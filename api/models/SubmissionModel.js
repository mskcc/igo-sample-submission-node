var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
    altServiceId: { type: Boolean, required: true },
    application: { type: String, required: true },
    container: { type: String, required: true },
    groupingChecked: { type: Boolean, required: true },
    material: { type: String, required: true },
    numberOfSamples: { type: Number, required: true },
    patientIdType: { type: String, required: true },
    serviceId: { type: String, required: false },
    species: { type: String, required: true },
})

var SubmissionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    serviceId: { type: String, required: true },
    material: { type: String, required: true },
    application: { type: String, required: true },
    formValues: [FormSchema],
    gridValues: { type: Object, required: true },
    version: { type: Number, required: true },
    submitted: { type: Boolean, required: true },
    submittedOn: { type: Date, required: true },
    transactionId: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
