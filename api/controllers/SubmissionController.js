
import CacheService from "../util/cache";
import { resolve } from "dns";
import { ContextRunnerImpl } from "express-validator/src/chain";
// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../util/apiResponse");
const { body, query, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const { authenticate, getUser } = require("../middlewares/jwt");
const util = require("../util/helpers");
var _ = require('lodash');
const service = require("../services/services");
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const { constants } = require("../util/constants");

var mongoose = require("mongoose");
const SubmissionModel = require("../models/SubmissionModel");


exports.list = [
    // authenticate,
    function (req, res) {
        SubmissionModel.find({}, '')
            .exec(function (err, submissions) {

                if (err) {
                    return apiResponse.ErrorResponse(
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


/**
 * Saves partial submission.
 *
 * @returns {Object}
 */
exports.savePartial = [
    // authenticate,
    // body("username").isLength({ min: 1 }).trim().withMessage("username must be specified."),
    // body("serviceId").isLength({ min: 1 }).trim().withMessage("serviceId must be specified."),
    // body("material").isLength({ min: 1 }).trim().withMessage("material must be specified."),
    // body("application").isLength({ min: 1 }).trim().withMessage("application must be specified."),
    body("formValues").isJSON().isLength({ min: 1 }).trim().withMessage("formValues must be JSON."),
    // body("formValues").not().isEmpty().trim().withMessage("formValues must be specified."),
    body("gridValues").isJSON().isLength({ min: 1 }).trim().withMessage("gridValues must be JSON."),
    // body("submitted").isLength({ min: 1 }).trim().withMessage("submitted must be specified."),
    // body("submittedOn").isLength({ min: 1 }).trim().withMessage("submittedOn must be specified."),
    body("transactionId").isLength({ min: 1 }).trim().withMessage("transactionId must be specified."),
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
            console.log(gridValues)    

            Promise.all([materialsPromise]).then((results) => {
                if (results.some(x => x.length == 0)) {
                    return apiResponse.ErrorResponse(
                        res,
                        `Could not retrieve materials and species for '${recipe}'.`
                    )
                }
                let [materialsResult] = results
                let responseObject = {
                    materials: materialsResult,
                    species: speciesResult,
                };
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    responseObject
                );
            })
        }
    }

];