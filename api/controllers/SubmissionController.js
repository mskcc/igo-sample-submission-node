const apiResponse = require('../util/apiResponse');
const { body, param, query, validationResult } = require('express-validator');
const util = require('../util/helpers');
const mailer = require('../util/mailer');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
// const { sqlSubmissions } = require('./sqlSubmissions');
const { logger } = require('../util/winston');

const SubmissionModel = require('../models/SubmissionModel');
const DmpSubmissionModel = require('../models/DmpSubmissionModel');

exports.list = [
    function (req, res) {
        SubmissionModel.find({}, '')
            .sort({ createdAt: 'desc' })
            .exec(function (err, submissions) {
                if (err) {
                    logger.error('Error pulling submissions from mongoDB');
                    return apiResponse.errorResponse(res, 'Could not retrieve submissions.');
                }
                return apiResponse.successResponseWithData(res, 'Operation success', {
                    submissions,
                });
            });
    },
];

exports.submission = [
    param('id').isMongoId().withMessage('id must be valid MongoDB ID.'),
    param('type').exists().withMessage('type must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let submissionType = req.params.type;
        let model = submissionType === 'dmp' ? DmpSubmissionModel : SubmissionModel;
        model.findById(ObjectId(req.params.id)).exec(function (err, submission) {
            if (err || !submission) {
                logger.error('Error finding submission. If ID was displayed to user, it should exist.');
                return apiResponse.errorResponse(res, 'Could not retrieve submission.');
            }
            return apiResponse.successResponseWithData(res, 'Operation success', {
                submission,
            });
        });
    },
];

exports.unsubmit = [
    body('id').isMongoId().withMessage('id must be valid MongoDB ID.'),
    body('type').isLength({ min: 1 }).withMessage('type must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }

        let submissionType = req.body.type;

        let model = submissionType === 'dmp' ? DmpSubmissionModel : SubmissionModel;

        model
            .findByIdAndUpdate(ObjectId(req.body.id), {
                submitted: false,
            })
            .exec(function (err, submission) {
                if (err) {
                    logger.error('Error finding submission during unsubmit. If ID was displayed to user, it should exist.');
                    return apiResponse.errorResponse(res, 'Could not retrieve submission.');
                }
                return apiResponse.successResponseWithData(res, 'Operation success', {
                    submission,
                });
            });
    },
];

// table for all todo: table for users
exports.grid = [
    param('type').exists().withMessage('type must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        console.log(res.user);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let submissionType = req.params.type;

        let model = submissionType === 'dmp' ? DmpSubmissionModel : SubmissionModel;
        model
            .find({}, '')
            .sort({ createdAt: 'desc' })
            .exec(function (err, submissions) {
                if (err) {
                    return apiResponse.errorResponse(res, 'Could not retrieve submissions.');
                }
                if (res.user.role === 'user') {
                    submissions = submissions.filter(
                        (submission) =>
                            submission.username &&
                            ( submission.username.toLowerCase() === res.user.username.toLowerCase() ||
                              submission.formValues.sharedWith.includes(res.user.username) )
                    );
                }
                let submissionGridPromise = util.generateSubmissionGrid(submissions, 'cmo_pm', submissionType);
                Promise.all([submissionGridPromise])
                    .then((results) => {
                        if (results.some((x) => x.length === 0)) {
                            return apiResponse.errorResponse(res, 'Could not retrieve submission grid.');
                        }
                        let [submissionGridResult] = results;
                        if (submissionType === 'dmp') {
                            console.log(res.user.role);

                            util.getAvailableProjectsFromDmp().then((ids) => {
                                // console.log(Array.from(ids));

                                apiResponse.successResponseWithData(res, 'Operation success', {
                                    ...submissionGridResult,
                                    dmpTrackingIds: Array.from(ids),
                                });
                            });
                        } else {
                            return apiResponse.successResponseWithData(res, 'Operation success', submissionGridResult);
                        }
                    })
                    .catch((reasons) => {
                        logger.error(reasons);
                        return apiResponse.errorResponse(res, reasons);
                    });
            });
    },
];

// table for all todo: table for users
exports.since = [
    param('type').isLength({ min: 1 }).withMessage('type must be specified.'),
    param('time').exists().isInt().withMessage('time limit must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let time = req.params.time;
        let submissionType = req.params.type;

        let model = submissionType === 'dmp' ? DmpSubmissionModel : SubmissionModel;
        model
            .find({ createdAt: { $gt: time } }, '')
            .sort({ createdAt: 'desc' })
            .exec(function (err, submissions) {
                if (err || _.isEmpty(submissions)) {
                    return apiResponse.errorResponse(res, 'No submissions found.');
                }

                if (res.user.role === 'user') {
                    submissions = submissions.filter(
                        (submission) =>
                            submission.username &&
                            ( submission.username.toLowerCase() === res.user.username.toLowerCase() ||
                              submission.formValues.sharedWith.includes(res.user.username) )
                    );
                }
                let submissionGridPromise = util.generateSubmissionGrid(submissions, res.user.role, submissionType);
                Promise.all([submissionGridPromise])
                    .then((results) => {
                        if (results.some((x) => x.length === 0)) {
                            return apiResponse.errorResponse(res, 'Could not retrieve submission grid.');
                        }
                        let [submissionGridResult] = results;
                        return apiResponse.successResponseWithData(res, 'Operation success', submissionGridResult);
                    })
                    .catch((reasons) => {
                        logger.error(reasons);
                        return apiResponse.errorResponse(res, reasons);
                    });
            });
    },
];

/**
 * Creates partial submission.
 *
 * @returns {Object}
 */
exports.create = [
    body('formValues').isJSON().isLength({ min: 1 }).trim().withMessage('formValues must be JSON.'),
    body('gridValues').isJSON().isLength({ min: 1 }).trim().withMessage('gridValues must be JSON.'),
    body('submissionType').isString().isLength({ min: 1 }).trim().withMessage('submissionType must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let formValues = JSON.parse(req.body.formValues);
        let gridValues = JSON.parse(req.body.gridValues);
        let submissionType = req.body.submissionType;
        let submission;
        if (submissionType === 'dmp') {
            submission = new DmpSubmissionModel({
                username: res.user.username,
                formValues: formValues,
                gridValues: gridValues,
                dmpTrackingId: gridValues[0].dmpTrackingId || '',
            });
            const serviceId = formValues.serviceId;
            if (serviceId) {
                const idCount = DmpSubmissionModel.find({"formValues.serviceId": serviceId}).count();
                console.log(idCount);
                if (idCount > 0) {
                    return apiResponse.errorResponse(res, `Submission could not be created. A request with the iLabs Service ID ${serviceId} already exists.`);
                }
            }
        } else {
            submission = new SubmissionModel({
                username: res.user.username,
                formValues: formValues,
                gridValues: gridValues,
            });
        }
        submission.save(function (err) {
            if (err) {
                logger.error(`Error saving submission: ${error}`);
                return apiResponse.errorResponse(res, 'Submission could not be saved.');
            }
            return apiResponse.successResponseWithData(res, 'Submission saved.', {
                submission: submission._doc,
            });
        });
    },
];

/**
 * Updates partial submission.
 *
 * @returns {Object}
 */
exports.update = [
    body('id').isString().withMessage('id must be String.'),
    body('submissionType').isString().withMessage('submissionType must be String.'),
    body('formValues').isJSON().isLength({ min: 1 }).trim().withMessage('formValues must be JSON.'),
    body('gridValues').isJSON().isLength({ min: 1 }).trim().withMessage('gridValues must be JSON.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }

        let formValues = JSON.parse(req.body.formValues);
        let gridValues = JSON.parse(req.body.gridValues);
        let updatedSubmission = {
            formValues: formValues,
            gridValues: gridValues,
        };
        let submissionType = req.body.submissionType;
        let id = req.body.id;
        console.log(req.body);

        let model = SubmissionModel;
        if (submissionType === 'dmp') {
            model = DmpSubmissionModel;
            updatedSubmission.dmpTrackingId = gridValues[0].dmpTrackingId || '';
        }
        console.log(id);

        model
            .findByIdAndUpdate(ObjectId(id), updatedSubmission, { new: true })
            .lean()
            .exec(function (err, submission) {
                console.log(err);
                console.log(submission);

                if (err || !submission) {
                    logger.error('Error updating submission. If ID was displayed to user, it should exist.');
                    return apiResponse.errorResponse(res, 'Could not update submission.');
                }
                return apiResponse.successResponseWithData(res, 'Operation success', {
                    submission: submission,
                });
            });
    },
];

/**
 * Submits to LIMS Banked Samples
 *
 * @returns {Object}
 */
exports.submit = [
    body('id').optional().isMongoId().withMessage('id must be valid MongoDB ID.'),
    body('transactionId').isInt().withMessage('id must be Int.'),
    body('formValues').isJSON().isLength({ min: 1 }).trim().withMessage('formValues must be JSON.'),
    body('gridValues').isJSON().isLength({ min: 1 }).trim().withMessage('gridValues must be JSON.'),
    function (req, res) {
        req.setTimeout(300000);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }

        let formValues = JSON.parse(req.body.formValues);
        let gridValues = JSON.parse(req.body.gridValues);
        let transactionId = req.body.transactionId;
        let id = req.body.id || undefined;

        let gridType = req.body.type;
        let model = gridType === 'dmp' ? DmpSubmissionModel : SubmissionModel;

        let findOrCreateSubPromise = model.findOrCreateSub(id, res.user.username);

        Promise.all([findOrCreateSubPromise])
            .then((results) => {
                let [submissionToSubmit] = results;

                submissionToSubmit.formValues = formValues;
                submissionToSubmit.gridValues = gridValues;
                if (gridType === 'dmp') {
                    submissionToSubmit.dmpTrackingId = gridValues[0].dmpTrackingId || '';
                }

                //  save pre LIMS submit so data is safe
                submissionToSubmit.save(function (err) {
                    if (err) {
                        return apiResponse.errorResponse(res, 'Submission could not be saved.');
                    }
                });
                let submissionPromise = util.submit(submissionToSubmit, res.user, transactionId);
                Promise.all([submissionPromise])

                    .then((results) => {
                        if (!results || results.some((x) => x.length === 0)) {
                            return apiResponse.errorResponse(res, 'Could not submit.');
                        }
                        mailer.sendNotification(submissionToSubmit);
                        let [submissionResult] = results;
                        submissionToSubmit.submitted = true;
                        submissionToSubmit.transactionId = transactionId;
                        submissionToSubmit.submittedAt = transactionId;
                        submissionToSubmit.save(function (err) {
                            if (err) {
                                return apiResponse.errorResponse(
                                    res,
                                    'Submission could not be saved on this site but was submitted to IGO.'
                                );
                            } else {
                                return apiResponse.successResponseWithData(res, 'Operation success', submissionResult);
                            }
                        });
                    })
                    .catch((reasons) => {
                        logger.error(reasons);
                        return apiResponse.errorResponse(res, reasons);
                    });
            })
            .catch((reasons) => {
                logger.error(reasons);
                return apiResponse.errorResponse(res, reasons);
            });
    },
];

exports.delete = [
    body('id').isMongoId().trim().withMessage('id must be valid MongoDB id.'),
    body('type').isLength({ min: 1 }).withMessage('type must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let id = req.body.id;
        let gridType = req.body.type;

        let model = gridType === 'dmp' ? DmpSubmissionModel : SubmissionModel;
        model.findByIdAndDelete(ObjectId(id)).exec(function (err) {
            if (err) {
                logger.error('Error deleting submission. If ID was displayed to user, it should exist.');
                return apiResponse.errorResponse(res, 'Could not delete submission.');
            }
            return apiResponse.successResponse(res, 'Operation success');
        });
    },
];

exports.download = [
    query('id').isMongoId().trim().withMessage('id must be valid MongoDB id.'),
    query('submissionType').isLength({ min: 1 }).withMessage('submissionType must be specified.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let id = req.query.id;
        let submissionType = req.query.submissionType;
        let model = submissionType === 'dmp' ? DmpSubmissionModel : SubmissionModel;
        model
            .findById(ObjectId(id))
            .lean()
            .exec(function (err, submission) {
                if (!submission || err) {
                    return apiResponse.errorResponse(res, 'Could not retrieve submission.');
                }
                let excelData = util.generateSubmissionExcel(submission, res.user.role);
                return apiResponse.successResponseWithData(res, 'Operation success', {
                    excelData,
                    fileName: `Receipt-${submission.formValues.serviceId}-${submission.username}`,
                });
            });
    },
];

//  used to import MySql receipts
exports.import = [
    function (req, res) {
        // let parsedSubmissions = [];
        // console.log(submissions.length);
        let parsedSubmissions = util.translateSqlSubmissions(sqlSubmissions);

        SubmissionModel.deleteMany({ appVersion: { $ne: '2.5' } }, function (err) {
            if (err) console.log(err);
            console.log('Successful deletion');
        });
        SubmissionModel.insertMany(parsedSubmissions)
            .then((documents) => {
                return apiResponse.successResponse(res, `${documents.length} submissions imported.`);
            })
            .catch((error) => {
                console.log(error); //DEV only

                return apiResponse.errorResponse(res, 'Could not import submissions.');
            });
    },
];
