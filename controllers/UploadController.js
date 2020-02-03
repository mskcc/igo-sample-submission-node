// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../util/apiResponse");
const { body, query, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const auth = require("../middlewares/jwt");
const util = require("../util/helpers");
const { constants } = require("../util/constants");

/**
 * Initial State, returns header values for submission form.
 *
 * @returns {Object}
 */
exports.headerValues = [
    // auth,
    function(req, res) {
        try {
            let applications;
            let containers;
            let species;
            let materials;

            util.getPicklist("Recipe").then(applicationsResult => {
                util.getPicklist("Exemplar+Sample+Types").then(
                    materialsResult => {
                        util.getPicklist("Species").then(speciesResult => {
                            if (
                                applicationsResult &&
                                materialsResult &&
                                speciesResult
                            ) {
                                containers = [
                                    "Plates",
                                    "Micronic Barcoded Tubes",
                                    "Blocks/Slides/Tubes"
                                ];

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
                            } else {
                                return apiResponse.ErrorResponse(
                                    res,
                                    "Could not retrieve picklists from LIMS."
                                );
                            }
                        });
                    }
                );
            });
        } catch (err) {
            console.log(err.stack);
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * Returns Materials and Species for application/recipe.
 *
 * @returns {Object}
 */
exports.materialsAndSpecies = [
    // auth,
    query("recipe")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Recipe must be specified."),
    function(req, res) {
        try {
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
                util.getMaterials(recipe).then(materialsResult => {
                    if (materialsResult && speciesResult) {
                        return apiResponse.successResponseWithData(
                            res,
                            "Operation success",
                            {
                                materials: materialsResult,
                                species: speciesResult
                            }
                        );
                    } else {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve materials and species for '${recipe}'.`
                        );
                    }
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
/**
 * Returns applications/recipes for materials.
 *
 * @returns {Object}
 */
exports.applicationsAndContainers = [
    // auth,
    query("material")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Material must be specified."),
    function(req, res) {
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
                util.getApplications(material).then(applicationsResult => {
                    if (applicationsResult && containersResult) {
                        return apiResponse.successResponseWithData(
                            res,
                            "Operation success",
                            {
                                applications: applicationsResult,
                                containers: containersResult
                            }
                        );
                    } else {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve applications and containers for '${material}'.`
                        );
                    }
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

exports.picklist = [
    // auth,
    query("picklist")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Picklist must be specified."),
    function(req, res) {
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
                util.getPicklist(picklist).then(picklistResult => {
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
    // auth,
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
    sanitizeBody("*").escape(),
    function(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(
                    res,
                    "Validation error.",
                    errors.array()
                );
            } else {
                let formValues = req.body;
                // console.log(formValues)

                util.getColumns(
                    formValues.material,
                    formValues.application
                ).then(columnsResult => {
                    if (columnsResult) {
                        let columns = util.generateGrid(
                            columnsResult,
                            formValues
                        );
                        return apiResponse.successResponseWithData(
                            res,
                            "Operation success",
                            {
                                columns: columns
                            }
                        );
                    } else {
                        return apiResponse.ErrorResponse(
                            res,
                            `Could not retrieve columns for '${material}' and '${application}'.`
                        );
                    }
                });
            }
        } catch (err) {
            console.log(error);
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * Submissions List.
 *
 * @returns {Object}
 */
exports.submissionsList = [
    auth,
    function(req, res) {
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
