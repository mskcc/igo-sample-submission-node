
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


exports.list = [
    // authenticate,
    function (req, res) {
        console.log(req)
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return apiResponse.validationErrorWithData(
        //         res,
        //         "Validation error.",
        //         errors.array()
        //     );
        // } else {

            return apiResponse.successResponseWithData(
                res,
                "Operation success",
                {}
            );
        }


]
/**
 * Returns Materials and Species for application/recipe.
 *
 * @returns {Object}
 */
exports.columns = [
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