
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
                else {
                    return apiResponse.successResponseWithData(
                        res,
                        "Operation success",
                        { submissions }
                    );
                }
            });
    }
]


exports.submission = [
    query("id").isString().isLength({ max: 1 }).trim().withMessage("id must be String."),
    function (req, res) {

        SubmissionModel.findById(ObjectId(req.params.id))
            .exec(function (err, submission) {
                if (err) {
                    return apiResponse.errorResponse(
                        res,
                        'Could not retrieve submission.'
                    )
                }
                else {
                    // submission.formValues.sharedWith = submission.formValues.sharedWith.replace(`${res.user.username}@mskcc.org`, '')
                    return apiResponse.successResponseWithData(
                        res,
                        "Operation success",
                        { submission }
                    );
                }
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
                else {
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
                        console.log(reasons)
                        return apiResponse.errorResponse(
                            res,
                            reasons
                        )
                    })
                }
            });
    }
]


/**
 * Saves partial submission.
 *
 * @returns {Object}
 */
exports.save = [
    // body("username").isLength({ min: 1 }).trim().withMessage("username must be specified."),
    // body("serviceId").isLength({ min: 1 }).trim().withMessage("serviceId must be specified."),
    // body("material").isLength({ min: 1 }).trim().withMessage("material must be specified."),
    // body("application").isLength({ min: 1 }).trim().withMessage("application must be specified."),
    body("id").optional().isString().withMessage("id must be String."),
    body("formValues").isJSON().isLength({ min: 1 }).trim().withMessage("formValues must be JSON."),
    // body("formValues").not().isEmpty().trim().withMessage("formValues must be specified."),
    body("gridValues").isJSON().isLength({ min: 1 }).trim().withMessage("gridValues must be JSON."),
    // body("submitted").isLength({ min: 1 }).trim().withMessage("submitted must be specified."),
    // body("submittedOn").isLength({ min: 1 }).trim().withMessage("submittedOn must be specified."),
    // body("transactionId").isLength({ min: 1 }).trim().withMessage("transactionId must be specified."),
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        } else {
            let formValues = JSON.parse(req.body.formValues)
            let gridValues = JSON.parse(req.body.gridValues)
            //  add username to sharedWith since backend has user object in case someone else than og user edited
            if (formValues.isShared) { 
                formValues.sharedWith = util.createSharedString(formValues.sharedWith, res.user.username) 
            }else{
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
        
                return apiResponse.successResponseWithData(res, 'Submission saved.', {submission: submission._doc})
            })

        
        }
    }

];