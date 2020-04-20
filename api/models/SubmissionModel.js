var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
    sharedWith: { type: String, default: "" },
    altServiceId: { type: Boolean, required: true },
    application: { type: String, required: true },
    container: { type: String, required: true },
    groupingChecked: { type: Boolean,  default:false },
    material: { type: String, required: true },
    numberOfSamples: { type: Number, required: true },
    patientIdType: { type: String, required: false },
    serviceId: { type: String, required: true },
    species: { type: String, required: true },
})

var SubmissionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    // serviceId: { type: String, required: true },
    // material: { type: String, required: true },
    // application: { type: String, required: true },
    formValues: FormSchema,
    gridValues: { type: Array, required: true },
    submitted: { type: Boolean, default: false },
    submittedAt: { type: Date, required: false },
    transactionId: { type: Number, required: false },
    appVersion: { type: String,default: "2.5" },
    createdAt: Number,
    updatedAt: Number,
}, {  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }});

module.exports = mongoose.model("Submission", SubmissionSchema);
