const jwtInCookie = require("jwt-in-cookie");
 
const apiResponse = require("../util/apiResponse");
exports.authenticate = function(req, res, next) {
    try {
        let user = jwtInCookie.validateJwtToken(req);
        req.user = user
    } catch(err){
        return apiResponse.unauthorizedResponse(res, "Invalid session");
    }
    next();
};