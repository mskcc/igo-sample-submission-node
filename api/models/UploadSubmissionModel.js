var mongoose = require('mongoose');

var UploadSubmissionSchema = new mongoose.Schema({
    Application : { type: String, required:true },
    Recipe : { type: String, required:true },
    Material: { type: String, required: true },
    ReadLength: { type: String, required: false },
    Container: { type: String, required: true },
    Species:{type: String, required:true}
},{collection:'uploadsubmission'});



module.exports = mongoose.model("uploadsubmission", UploadSubmissionSchema);

