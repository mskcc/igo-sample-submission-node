
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

/**
 * Initial State, returns header values for submission form.
 *
 * @returns {Object}
 */
exports.headerValues = [
    // authenticate,
    function (req, res) {


        let containers = constants.containers

        let applicationsPromise = cache.get("Recipe-Picklist", () => service.getPicklist("Recipe"))
        let materialsPromise = cache.get("Exemplar+Sample+Types", () => service.getPicklist("Exemplar+Sample+Types"))
        let speciesPromise = cache.get("Species", () => service.getPicklist("Species"))

        Promise.all([applicationsPromise, materialsPromise, speciesPromise]).then((results) => {
            if (results.some(x => x.length == 0)) {
                return apiResponse.ErrorResponse(
                    res,
                    "Could not retrieve picklists from LIMS."
                )
            }
            let [applicationsResult, materialsResult, speciesResult] = results

            let responseObject = {
                applications: applicationsResult,
                materials: materialsResult,
                species: speciesResult,
                containers: containers
            };
            return apiResponse.successResponseWithData(
                res,
                "Operation success",
                responseObject
            );

        }).catch(error => {
            return apiResponse.ErrorResponse(
                error,
                "Could not retrieve picklists from LIMS."
            )
        })

    }

]

/**
 * Returns Materials and Species for application/recipe.
 *
 * @returns {Object}
 */
exports.materialsAndSpecies = [
    // authenticate,
    query("recipe")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Recipe must be specified."),
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        } else {
            let recipe = req.query.recipe;
            let speciesResult = util.getSpecies(recipe);
            let materialsPromise = cache.get(recipe + "-Materials", () => service.getMaterials(recipe))

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
/**
 * Returns applications/recipes for materials.
 *
 * @returns {Object}
 */
exports.applicationsAndContainers = [
    // authenticate,
    query("material")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Material must be specified."),
    function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(
                    res,
                    "Validation error.",
                    errors.array()
                );
            } else {
                let material = req.query.material;
                let containersResult = util.getContainers(material);
                let applicationsPromise = cache.get(material + "-Applications", () => service.getApplications(material))

                Promise.all([applicationsPromise]).then((results) => {
                    if (results.some(x => x.length == 0)) {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve applications and containers for '${material}'.`
                        )
                    }
                    let [applicationsResult] = results
                    let responseObject = {
                        applications: applicationsResult,
                        containers: containersResult,
                    };
                    return apiResponse.successResponseWithData(
                        res,
                        "Operation success",
                        responseObject
                    );
                })

            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

exports.picklist = [
    // authenticate,
    query("picklist")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Picklist must be specified."),
    function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(
                    res,
                    "Validation error.",
                    errors.array()
                );
            } else {
                let picklist = req.query.picklist;
                cache.get(picklist + "-Picklist", () => service.getPicklist(picklist)).then(picklistResult => {
                    if (picklistResult) {
                        return apiResponse.successResponseWithData(
                            res,
                            "Operation success",
                            { listname: picklist, picklist: picklistResult }
                        );
                    } else {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve picklist '${picklist}'.`
                        );
                    }
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

exports.grid = [
    authenticate,
    body("application")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Application must be present."),
    body("material")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Material must be present."),
    body("serviceId")
        .isLength({ min: 1 })
        .trim()
        .withMessage("ServiceId must be present."),
    body("numberOfSamples")
        .isLength({ min: 1 })
        .trim()
        .withMessage("NumberOfSamples must be present."),
    body("species")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Species must be present."),
    body("container")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Container must be present."),
    body("patientIdType")
        .isLength({ min: 1 })
        .trim()
        .withMessage("PatientIdType must be present."),
    body("groupingChecked")
        .isLength({ min: 1 })
        .trim()
        .withMessage("GroupingChecked must be present."),
    body("altServiceId")
        .isLength({ min: 1 })
        .trim()
        .withMessage("AltServiceId must be present."),
    // sanitizeBody("*").escape(),
    async function (req, res) {
        // try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
                res,
                "Validation error.",
                errors.array()
            );
        } else {
            let formValues = req.body;
            console.log(formValues)
            // return
            let material = formValues.material
            let application = formValues.application

            let columnsPromise = cache.get(`${material}-${application}-Columns`, () => service.getColumns(material, application))


            Promise.all([columnsPromise]).then((results) => {
                if (results.some(x => x.length == 0)) {
                    return apiResponse.ErrorResponse(
                        res,
                        `Could not retrieve grid for '${material}' and '${application}'.`
                    )
                }

                let [columnsResult] = results
                let gridPromise = util.generateGrid(columnsResult, req.user.role, formValues)

                Promise.all([gridPromise]).then((results) => {
                    if (results.some(x => x.length == 0)) {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve grid for '${material}' and '${application}'.`
                        )
                    }
                    let [gridResult] = results
                    return apiResponse.successResponseWithData(
                        res,
                        "Operation success",
                        gridResult
                    );

                }).catch((reasons) => {
                    console.log(reasons)
                    return apiResponse.ErrorResponse(
                        res,
                        reasons
                    )
                })
            })
        }
        //         .then(columnsResult => {
        //         if (columnsResult) {
        //             util.generateGrid(
        //                 columnsResult,
        //                 formValues,
        //                 req.user.role
        //             ).then(gridResult => {
        //                 console.log("done with grid")
        //                 if (gridResult) {
        //                     // console.log(columns);
        //                     return apiResponse.successResponseWithData(
        //                         res,
        //                         "Operation success",
        //                         {
        //                             columns: gridResult.columns,
        //                             user: req.user
        //                         }
        //                     );
        //                 }
        //             });
        //         } else {
        //             return apiResponse.ErrorResponse(
        //                 res,
        //                 `Could not retrieve columns for '${material}' and '${application}'.`
        //             );
        //         }
        //     })
        // .catch(err => {
        //     console.log(err);
        //     return apiResponse.ErrorResponse(res, err);
        // });
        //     }
        // } catch (err) {
        //     console.log(error);
        //     return apiResponse.ErrorResponse(res, err);
        // }
    }
];

/**
 * Submissions List.
 *
 * @returns {Object}
 */
exports.submissionsList = [
    // authenticate,
    function (req, res) {
        try {
            return apiResponse.successResponseWithData(
                res,
                "Operation success",
                "submissions"
            );
            // Book.find({user: req.user._id},"_id title description isbn createdAt").then((books)=>{
            //     if(books.length > 0){
            //         return apiResponse.successResponseWithData(res, "Operation success", books);
            //     }else{
            //         return apiResponse.successResponseWithData(res, "Operation success", []);
            //     }
            // });
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
