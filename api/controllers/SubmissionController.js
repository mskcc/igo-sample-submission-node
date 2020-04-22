
import CacheService from "../util/cache";
const apiResponse = require("../util/apiResponse");
const { body, query, validationResult } = require("express-validator");
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
    query("id").isString().isLength({ min: 1 }).trim().withMessage("id must be String."),
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
                let submissionGridPromise = util.generateSubmissionGrid(submissions)
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
 * Saves partial submission.
 *
 * @returns {Object}
 */
exports.save = [
    body("id").optional().isString().withMessage("id must be String."),
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
        //  add username to sharedWith since backend has user object in case someone else than og user edited
        if (formValues.isShared) {
            formValues.sharedWith = util.createSharedString(formValues.sharedWith, res.user.username)
        } else {
            formValues.sharedWith = ""
        }

        // if (formValues.sharedWith){
        //     formValues.sharedWith += `,${username}@mskcc.org`
        // }
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
