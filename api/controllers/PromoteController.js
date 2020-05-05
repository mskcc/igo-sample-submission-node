const apiResponse = require("../util/apiResponse");
const { body, param, validationResult } = require("express-validator");
const services = require("../services/services");
const util = require("../util/helpers");
import CacheService from "../util/cache";
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl);



exports.grid = [
    function (req, res) {
        let columnsPromise = cache.get("ReceiptPromote+Ordering-Picklist", () => services.getPicklist("ReceiptPromote+Ordering"))
        Promise.all([columnsPromise]).then((results) => {
            if (results.some(x => x.length == 0)) {
                return apiResponse.errorResponse(res, `Could not retrieve promote grid.`)
            }
            let [columnsResult] = results
            let gridPromise = cache.get("Promote-Grid", () => util.generatePromoteGrid(columnsResult))

            Promise.all([gridPromise]).then((results) => {
                if (results.some(x => x.length == 0)) {
                    return apiResponse.errorResponse(res, `Could not retrieve promote grid.`)
                }
                let [gridResult] = results
                return apiResponse.successResponseWithData(
                    res,
                    "Operation success",
                    gridResult
                )

            }).catch((reasons) => {
                return apiResponse.errorResponse(
                    res,
                    reasons
                )
            })
        })
    }
];
