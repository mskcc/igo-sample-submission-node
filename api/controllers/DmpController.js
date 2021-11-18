const apiResponse = require('../util/apiResponse');
const { body, query, validationResult } = require('express-validator');
const util = require('../util/helpers');
const services = require('../services/services');
const { authenticate } = require('../middlewares/jwt');
var _ = require('lodash');
import CacheService from '../util/cache';
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const DmpSubmissionModel = require('../models/DmpSubmissionModel');
const SubmissionModel = require('../models/SubmissionModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
/**
 * Initial State, returns header values for submission form.
 *
 * @returns {Object}
 */
exports.headerValues = [
    authenticate,
    function (req, res) {
        const materialPicklist = 'DmpMaterials';
        const applicationsPicklist = 'DmpApplications';
        let materialsPromise = cache.get(`${materialPicklist}-Picklist`, () => services.getPicklist(materialPicklist));
        let applicationsPromise = cache.get(`${applicationsPicklist}-Picklist`, () => services.getPicklist(applicationsPicklist));

        Promise.all([applicationsPromise, materialsPromise])
            .then((results) => {
                if (results.some((x) => x.length === 0)) {
                    return apiResponse.errorResponse(res, 'Could not retrieve picklists from LIMS.');
                }
                let [applicationsResult, materialsResult] = results;

                let responseObject = {
                    applications: applicationsResult,
                    materials: materialsResult,
                };
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((error) => {
                return apiResponse.errorResponse(error, 'Could not retrieve picklists from LIMS.');
            });
    },
];

exports.picklist = [
    authenticate,
    query('picklist').isLength({ min: 1 }).trim().withMessage('Picklist must be specified.'),
    function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
            } else {
                let picklist = req.query.picklist;
                cache
                    .get(picklist + '-Picklist', () => services.getPicklist(picklist))
                    .then((picklistResult) => {
                        if (picklistResult) {
                            return apiResponse.successResponseWithData(res, 'Operation success', {
                                listname: picklist,
                                picklist: picklistResult,
                            });
                        } else {
                            return apiResponse.errorResponse(res, `Could not retrieve picklist '${picklist}'.`);
                        }
                    });
            }
        } catch (err) {
            return apiResponse.errorResponse(res, err);
        }
    },
];

exports.grid = [
    authenticate,
    body('application').isLength({ min: 1 }).trim().withMessage('Application must be present.'),
    body('material').isLength({ min: 1 }).trim().withMessage('Material must be present.'),
    body('numberOfSamples').isLength({ min: 1 }).trim().withMessage('NumberOfSamples must be present.'),
    function (req, res) {
        // try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        } else {
            let formValues = req.body;
            let material = formValues.material;
            let application = formValues.application;

            let columnsPromise = cache.get(`${material}-${application}-Columns`, () => util.getDmpColumns(material, application));
            columnsPromise
                .then((results) => {
                    if (!results || results.some((x) => x.length === 0)) {
                        return apiResponse.errorResponse(res, `Could not retrieve grid for '${material}' and '${application}'.`);
                    }
                    let columnsResult = results;
                    // let gridPromise = util.generateGrid(columnsResult, 'lab_member', formValues, 'dmp');
                    let gridPromise = util.generateGrid(columnsResult, res.user.role, formValues, 'dmp');
                    gridPromise
                        .then((results) => {
                            let gridResult = results;
                            return apiResponse.successResponseWithData(res, 'Operation success', gridResult);
                        })
                        .catch((reasons) => {
                            return apiResponse.errorResponse(res, reasons);
                        });
                })
                .catch((reasons) => {
                    return apiResponse.errorResponse(res, reasons);
                });
        }
    },
];

exports.crdbId = [
    authenticate,
    body('patientId').isLength({ min: 1 }).trim().withMessage('patientId must be specified.'),
    function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
            } else {
                // remove leading and trailing whitespaces just in case
                let patientId = req.body.patientId.replace(/^\s+|\s+$/g, '');
                let patientIdPromise = services.getCrdbId(patientId);

                Promise.all([patientIdPromise])
                    .catch(function (err) {
                        return apiResponse.errorResponse(res, err);
                    })
                    .then((results) => {
                        if (results.some((x) => x.length === 0)) {
                            return apiResponse.errorResponse(res, 'Could not anonymize ID.');
                        }
                        let [patientIdResult] = results;
                        let responseObject = {
                            ...patientIdResult,
                        };
                        return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
                    });
            }
        } catch (err) {
            return apiResponse.errorResponse(res, err);
        }
    },
];

exports.additionalRows = [
    authenticate,
    body('formValues').isJSON().isLength({ min: 1 }).trim().withMessage('formValues must be JSON.'),
    body('columnFeatures').isJSON().isLength({ min: 1 }).trim().withMessage('columnFeatures must be JSON.'),
    body('prevRowNumber').isInt().isLength({ min: 1 }).trim().withMessage('prevRowNumber must be int.'),
    body('newRowNumber').isInt().isLength({ min: 1 }).trim().withMessage('newRowNumber must be int.'),
    function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
            } else {
                let columnFeatures = JSON.parse(req.body.columnFeatures);
                let formValues = JSON.parse(req.body.formValues);
                let prevRowNumber = req.body.prevRowNumber;
                let newRowNumber = req.body.newRowNumber;

                let rowPromise = util.generateAdditionalRows(columnFeatures, formValues, prevRowNumber, newRowNumber);

                Promise.all([rowPromise]).then((results) => {
                    if (results.some((x) => x.length === 0)) {
                        return apiResponse.errorResponse(res, 'Could not retrieve autofilled row.');
                    }
                    let [additionalRows] = results;
                    let responseObject = {
                        additionalRows,
                    };
                    return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
                });
            }
        } catch (err) {
            return apiResponse.errorResponse(res, err);
        }
    },
];

exports.export = [
    authenticate,
    body('grid').isJSON().isLength({ min: 1 }).trim().withMessage('grid must be JSON.'),
    body('application').isLength({ min: 1 }).trim().withMessage('Application must be present.'),
    body('material').isLength({ min: 1 }).trim().withMessage('Material must be present.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let grid = JSON.parse(req.body.grid);
        let material = req.body.material;
        let application = req.body.application;
        let excelData = util.generateGridExcel(grid, res.user.role);

        return apiResponse.successResponseWithData(res, 'Operation success', {
            excelData,
            fileName: `${res.user.username}-Submission-Grid-${material}-${application}`,
        });
    },
];

/**
 * Submits to Sample Submission table, either reviewed (submitted and approved by PM) or unreviewed (by user)
 *
 * @returns {Object}
 */
exports.submit = [
    authenticate,
    body('id').optional().isMongoId().withMessage('id must be valid MongoDB ID.'),
    body('transactionId').isInt().withMessage('id must be Int.'),
    body('reviewed').isBoolean().withMessage('reviewed must be Boolean.'),
    body('formValues').isJSON().isLength({ min: 1 }).trim().withMessage('formValues must be JSON.'),
    body('gridValues').isJSON().isLength({ min: 1 }).trim().withMessage('gridValues must be JSON.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let formValues = JSON.parse(req.body.formValues);
        let gridValues = JSON.parse(req.body.gridValues);
        let transactionId = req.body.transactionId;
        let reviewed = req.body.reviewed;
        let id = req.body.id || undefined;

        let findOrCreateSubPromise = DmpSubmissionModel.findOrCreateSub(id, res.user.username);

        Promise.all([findOrCreateSubPromise])
            .then((results) => {
                let [submissionToSubmit] = results;
                submissionToSubmit.formValues = formValues;
                submissionToSubmit.gridValues = gridValues;
                submissionToSubmit.submitted = true;
                submissionToSubmit.transactionId = transactionId;
                submissionToSubmit.submittedAt = transactionId;
                submissionToSubmit.reviewed = reviewed;
                submissionToSubmit.reviewedAt = reviewed ? transactionId : undefined;
                submissionToSubmit.reviewedBy = reviewed ? res.user.username : undefined;

                // submissionToSubmit.samplesApproved = approvals.length;
                //  save pre LIMS submit so data is safe
                submissionToSubmit.save(function (err) {
                    if (err) {
                        return apiResponse.errorResponse(res, 'Submission could not be saved.');
                    } else {
                        return apiResponse.successResponseWithData(res, 'Operation success', submissionToSubmit);
                    }
                });
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, reasons);
            });
    },
];

// TODO time cutoff?
// PUT cmoRequest and dmpResponse IDs in with the smaples in DMP table
//  QUESTION DO they want dmpRequestId to be an identifier for a group of projects?
exports.readyForDmp = [
    query('dmpRequestId').isUUID().trim().withMessage('dmpRequestId must be valid GUID.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        const dmpRequestId = req.query.dmpRequestId;
        const model = DmpSubmissionModel;
        const filter = { reviewed: true };
        const sort = { createdAt: 'desc' };

        model
            .find(filter)
            .sort(sort)
            .lean()
            .exec(function (err, submissions) {
                if (err || !submissions) {
                    return apiResponse.errorResponse(res, 'Could not retrieve submission.');
                }

                util.publishDmpData(submissions, dmpRequestId).then((dmpData) => {
                    return res.status(200).json(dmpData);
                });
            });
    },
];

// Query DMP and update submissions accordingly
exports.updateStatus = [
    function (req, res) {
        let dmpPromise = util.getAvailableProjectsFromDmp();

        dmpPromise
            .then((availableTrackingIds) => {
                if (!availableTrackingIds) {
                    return apiResponse.successResponse(res, 'No projects returned by the DMP.');
                }
                // sets isAvailableAtDmp to true for any tracking IDs that are returned from the DMP - then PMs will be able to load samples from DMP and submit to IGO
                DmpSubmissionModel.updateMany(
                    { dmpTrackingId: { $in: [...availableTrackingIds] }, isAvailableAtDmp: false },
                    { isAvailableAtDmp: true }
                )
                    .lean()
                    .then((writeResult) => {
                        if (writeResult.n === 0) {
                            return apiResponse.successResponse(res, 'No new projects since the last update.');
                        } else {
                            return apiResponse.successResponse(res, `${writeResult.nModified} projects newly available.`);
                        }
                    });
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, reasons);
            });
    },
];

exports.loadFromDmp = [
    body('dmpTrackingId').isLength({ min: 1 }).trim().withMessage('TrackingId must be present.'),
    body('dmpSubmissionId').isMongoId().withMessage('dmpSubmissionId must be valid MongoDB ID.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        } else {
            let dmpTrackingId = req.body.dmpTrackingId;
            let dmpSubmissionId = req.body.dmpSubmissionId;

            let dmpOutputPromise = services.getProjectFromDmp(dmpTrackingId);
            let dmpSubmissionPromise = DmpSubmissionModel.findById(ObjectId(dmpSubmissionId)).lean();

            Promise.all([dmpOutputPromise, dmpSubmissionPromise])
                .then((results) => {
                    const [dmpOutput, retrievedDmpSubmission] = results;

                    if (dmpOutput.result !== 'Success') {
                        return apiResponse.errorResponse(res, 'Issues communicating with DMP.');
                    } else if (_.isEmpty(dmpOutput.content['CMO Sample Request Details'])) {
                        return apiResponse.errorResponse(res, 'No sample information returned from DMP.');
                    } else if (_.isEmpty(retrievedDmpSubmission)) {
                        return apiResponse.errorResponse(res, 'Error retrieving this submission from DB.');
                    } else {
                        util.parseDmpOutput(dmpOutput, retrievedDmpSubmission)
                            .then((result) => {
                                let translatedSubmission = result.parsedSubmission;
                                let issues = result.translationIssues;

                                // if this has been previously loaded from DMP, overwrite previous submission instead of creating a new one
                                let relatedIgoSubmission_id = retrievedDmpSubmission.relatedIgoSubmission_id || '';
                                let username = retrievedDmpSubmission.username;

                                SubmissionModel.findOrCreateSub(relatedIgoSubmission_id, username).then((igoSubmission) => {
                                    igoSubmission.gridValues = translatedSubmission.gridValues;
                                    igoSubmission.formValues = translatedSubmission.formValues;
                                    igoSubmission.dmpTrackingId = dmpTrackingId;

                                    igoSubmission.save(function (err) {
                                        if (err) {
                                            return apiResponse.errorResponse(res, 'IGO Submission could not be saved.');
                                        }
                                        // update existing dmpSubmission document to connect igoSubmission and indicate last load date
                                        DmpSubmissionModel.findByIdAndUpdate(ObjectId(dmpSubmissionId), {
                                            relatedIgoSubmission_id: igoSubmission._id,
                                            loadedFromDmpAt: util.getTransactionIdForMongo(),
                                        }).exec(function (err, result) {
                                            if (err) {
                                                console.log(err);
                                                return apiResponse.errorResponse(res, 'Retrieved DMP submission could not be updated.');
                                            }
                                            // console.log(issues);

                                            return apiResponse.successResponseWithData(res, 'Submission saved.', {
                                                submission: igoSubmission._doc,
                                                issues: issues,
                                            });
                                        });
                                    });
                                });
                            })
                            .catch((reasons) => {
                                return apiResponse.errorResponse(res, reasons);
                            });
                    }
                })
                .catch((reasons) => {
                    console.log(reasons);

                    return apiResponse.errorResponse(res, reasons);
                });
        }
    },
];

//  Shows tracking IDs of DMP Submissions ready for dmp pickup (have isReviewed status)
//  shows ids of projects reviewedAt up to 60 days prior of requested timestamp
//  date format: UNIX timestamp in seconds. 01/27/2021 @ 2:45pm (UTC) => 1596746317
exports.trackingIdList = [
    query('date').isString().trim().withMessage('date must be present.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let date = new Date(parseInt(req.query.date) * 1000);
        // returns date 60 days prior
        date.setDate(date.getDate() - 60);
        // return to UNIX timestamp in seconds
        let sixtyDaysPrior = date.getTime() / 1000;

        if (isNaN(date)) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', 'Date must be unix timestamp (seconds) string.');
        }

        let dmpPromise = DmpSubmissionModel.find({ reviewedAt: { $gt: sixtyDaysPrior } });
        res.user = 'dmp';
        Promise.all([dmpPromise])
            .then((results) => {
                let submissions = results[0];
                if (_.isEmpty(submissions)) {
                    return apiResponse.errorResponse(res, 'No submissions within 60 days of this timestamp.');
                }
                let idList = [];
                submissions.map((sub) => {
                    idList.push(sub.gridValues[0].dmpTrackingId);
                    // console.log(sub.trackingId);
                    // console.log(sub.transactionId);
                    // console.log(sub.trackingId);
                });
                // console.log(idList);

                return apiResponse.successResponseWithData(res, 'Operation success', { idList });
                // });
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, reasons);
            });
    },
];

//  Show meta information for a given dmp tracking id
// Fields DMP needs:DMP Sample ID
// Sample Type
// Study Subject Identifier
// Study Sample Identifier
// Tracking ID
// Project Title
// Project PI
// Specimen Type
// Sample Approved by CMO
// DMP to Transfer
// TODO: Only show samples approved for dmp transfer
exports.igoSampleInformation = [
    query('trackingId').isString().trim().withMessage('trackingIS must be present.'),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, 'Validation error.', errors.array());
        }
        let trackingId = req.query.trackingId;

        let dmpPromise = DmpSubmissionModel.findOne({ dmpTrackingId: trackingId });
        res.user = 'dmp';
        Promise.all([dmpPromise])
            .then((results) => {
                let submission = results[0];
                if (_.isEmpty(submission)) {
                    return apiResponse.errorResponse(res, 'No submission found for this tracking ID.');
                }
                let result = {};
                result[trackingId] = {
                    samples: [],
                };
                submission.gridValues.forEach((sample) => {
                    // only include samples approved by Cmo PM's
                    if (sample.isApproved) {
                        result[trackingId].samples.push({
                            dmpId: sample.dmpSampleId,
                            requestType: sample.sampleType,
                            studySubjectIdentifier: sample.studySubjectIdentifier ? sample.studySampleIdentifier : '',
                            trackingId: sample.dmpTrackingId,
                            projectName: sample.projectTitle ? sample.projectTitle : '',
                            pIName: sample.projectPi ? sample.projectPi : '',
                            studySampleIdentifier: sample.studySampleIdentifier ? sample.studySampleIdentifier : '',
                            specimenType: submission.formValues.material.includes('Library') ? 'Library' : submission.formValues.material,
                            sampleApprovedByCmo: sample.isApproved,
                            dmpToTransfer: sample.dmpToTransfer,
                            recordStatus: '',
                            updateFieldList: [],
                            amountRequested: sample.amountRequested,
                            // Based on the requirements list following are:
                            // Implemented:
                            // dmpId	                    P-0005004-T01-IM5
                            // requestType	                Request Type
                            // studySubjectIdentifier	    Study Subject Identifier
                            // trackingID	                CMO Tracking ID
                            // projectName	                Project Name
                            // pIName	                    PI Name
                            // studySampleIdentifier	    Study Sample Identifier
                            // specimenType	                Specimen Type
                            // sampleApprovedByCMO	        Sample Approved By CMO
                            // dMPToTransfer	            DMP to Transfer (Yes/No)

                            // Implemented as empty values. Required logic will be implemented in Phase 2.
                            // recordStatus	                Record new, update or remove
                            // updateFieldList	            Array of field where updates to be made
                        });
                    }
                });

                console.log(result);
                return apiResponse.successResponseWithData(res, 'Operation success', { result });
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, reasons);
            });
    },
];
