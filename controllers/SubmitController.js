
// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../util/apiResponse");
const auth = require("../middlewares/jwt");

/**
 * Book List.
 * 
 * @returns {Object}
 */
exports.submissionsList = [
    auth,
    function (req, res) {
        try {
            return apiResponse.successResponseWithData(res, "Operation success", "submissions");
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
