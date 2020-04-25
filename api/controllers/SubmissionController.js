
import CacheService from "../util/cache";
const apiResponse = require("../util/apiResponse");
const { body, param, validationResult } = require("express-validator");
const util = require("../util/helpers");
var _ = require('lodash');
const service = require("../services/services");
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const { constants } = require("../util/constants");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const SubmissionModel = require("../models/SubmissionModel");


exports.list = [
    function (req, res) {
        SubmissionModel.find({}, '')
            .exec(function (err, submissions) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not retrieve submissions.'
                    )
                }
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    { submissions }
                )
            })
    }
]


exports.submission = [
    param("id").isMongoId().withMessage("id must be valid MongoDB ID."),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }

        SubmissionModel.findById(ObjectId(req.params.id))
            .exec(function (err, submission) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not retrieve submission.'
                    )
                }
                // submission.formValues.sharedWith = submission.formValues.sharedWith.replace(`${res.user.username}@mskcc.org`, '')
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    { submission }
                );
            });
    }
]


exports.unsubmit = [
    body("id").isMongoId().withMessage("id must be valid MongoDB ID."),
    function (req, res) {
        console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }

        SubmissionModel.findByIdAndUpdate(ObjectId(req.body.id), { submitted: false })
            .exec(function (err, submission) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not retrieve submission.'
                    )
                }
                // submission.formValues.sharedWith = submission.formValues.sharedWith.replace(`${res.user.username}@mskcc.org`, '')
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    { submission }
                );
            });
    }
]

// table for all todo: table for users
exports.grid = [
    function (req, res) {
        SubmissionModel.find({}, '')
            .exec(function (err, submissions) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not retrieve submissions.'
                    )
                }
                let submissionGridPromise = util.generateSubmissionGrid(submissions, res.user.role)
                Promise.all([submissionGridPromise]).then((results) => {
                    if (results.some(x => x.length == 0)) {
                        return apiResponse.errorResponse(
                            res,
                            `Could not retrieve submission grid.`
                        )
                    }
                    let [submissionGridResult] = results
                    return apiResponse.successResponseWithData(
                        res,
                        "Operation success",
                        submissionGridResult
                    );

                }).catch((reasons) => {
                    return apiResponse.errorResponse(
                        res,
                        reasons
                    )
                })

            });
    }
]


/**
 * Creates partial submission.
 *
 * @returns {Object}
 */
exports.create = [
    body("formValues").isJSON().isLength({ min: 1 }).trim().withMessage("formValues must be JSON."),
    body("gridValues").isJSON().isLength({ min: 1 }).trim().withMessage("gridValues must be JSON."),
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }

        let formValues = JSON.parse(req.body.formValues)
        let gridValues = JSON.parse(req.body.gridValues)

        let submission = new SubmissionModel({
            username: res.user.username,
            formValues: formValues,
            gridValues: gridValues,
            appVersion: "2.5"
        })
        submission.save(function (err) {
            if (err) {
                return apiResponse.errorResponse(res, "Submission could not be saved.");
            }
            return apiResponse.successResponseWithData(res, 'Submission saved.', { submission: submission._doc })
        })
    }
];


/**
 * Updates partial submission.
 *
 * @returns {Object}
 */
exports.update = [
    body("id").isString().withMessage("id must be String."),
    body("formValues").isJSON().isLength({ min: 1 }).trim().withMessage("formValues must be JSON."),
    body("gridValues").isJSON().isLength({ min: 1 }).trim().withMessage("gridValues must be JSON."),
    function (req, res) {
        // console.log(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }

        let formValues = JSON.parse(req.body.formValues)
        let gridValues = JSON.parse(req.body.gridValues)
        let id = req.body.id

        SubmissionModel.findByIdAndUpdate(ObjectId(id), { formValues: formValues, gridValues: gridValues })
            .exec(function (err, submission) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not update submission.'
                    )
                }
                // submission.formValues.sharedWith = submission.formValues.sharedWith.replace(`${res.user.username}@mskcc.org`, '')
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    { submission: submission._doc }
                );
            });

    }
];


/**
 * Submits to LIMS Banked Samples
 *
 * @returns {Object}
 */
exports.submit = [
    body("id").optional().isMongoId().withMessage("id must be valid MongoDB ID."),
    body("transactionId").isInt().withMessage("id must be Int."),
    body("formValues").isJSON().isLength({ min: 1 }).trim().withMessage("formValues must be JSON."),
    body("gridValues").isJSON().isLength({ min: 1 }).trim().withMessage("gridValues must be JSON."),
    function (req, res) {
        // console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }

        let formValues = JSON.parse(req.body.formValues)
        let gridValues = JSON.parse(req.body.gridValues)
        let transactionId = req.body.transactionId
        let id = req.body.id || undefined

        let findOrCreateSubPromise = SubmissionModel.findOrCreateSub(id, res.user.username)

        Promise.all([findOrCreateSubPromise]).then((results) => {
            let [submissionToSubmit] = results
            submissionToSubmit.formValues = formValues
            submissionToSubmit.gridValues = gridValues

            //  save pre LIMS submit so data is safe
            submissionToSubmit.save(function (err) {
                if (err) {
                    return apiResponse.errorResponse(res, "Submission could not be saved.");
                }
            })
            let submissionPromise = util.submit(submissionToSubmit, res.user, transactionId)
            Promise.all([submissionPromise]).then((results) => {
                if (results.some(x => x.length == 0)) {
                    return apiResponse.errorResponse(
                        res,
                        `Could not submit.`
                    )
                }
                let [submissionResult] = results
                submissionToSubmit.submitted = true
                submissionToSubmit.transactionId = transactionId
                submissionToSubmit.submittedAt = transactionId
                submissionToSubmit.save(function (err) {
                    if (err) {
                        return apiResponse.errorResponse(res, "Submission could not be saved on this site but was submitted to IGO.");
                    }
                })
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    submissionResult
                );


            })
        }).catch((reasons) => {
            return apiResponse.errorResponse(
                res,
                reasons
            )
        })
    }
];


exports.delete = [
    body("id").isLength({ min: 1 }).trim().withMessage("submission id must be specified."),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        }
        let id = req.body.id
        SubmissionModel.findByIdAndDelete(ObjectId(id))
            .exec(function (err) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not delete submission.'
                    )
                }
                return apiResponse.successResponse(
                    res,
                    "Operation success",

                )
            })
    }
]
