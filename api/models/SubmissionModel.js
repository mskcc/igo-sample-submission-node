var mongoose = require('mongoose');
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
var ObjectId = mongoose.Types.ObjectId;
const APP_VERSION = process.env.APP_VERSION;

var FormSchema = new mongoose.Schema({
    sharedWith: { type: String, default: '' },
    altServiceId: { type: Boolean, default: false },
    application: { type: String, required: true },
    capturePanel: { type: String, required: false },
    container: { type: String, required: true },
    groupingChecked: { type: Boolean, default: false },
    material: { type: String, required: true },
    numberOfSamples: { type: Number, required: true },
    patientIdType: { type: String, required: false },
    patientIdTypeSpecified: { type: String, required: false },
    serviceId: { type: String, required: true },
    species: { type: String, required: true },
});

var SubmissionSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        formValues: FormSchema,
        gridValues: { type: Array, required: true },
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Number, required: false },
        transactionId: { type: Number, required: false },
        appVersion: { type: String, default: APP_VERSION },
        dmpTrackingId: { type: String, default: '' },
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

SubmissionSchema.static('findOrCreateSub', function (id, username) {
    return new Promise((resolve, reject) => {
        if (id) {
            this.findById(ObjectId(id)).exec(function (err, dbSubmission) {
                if (err || !dbSubmission) {
                    reject('Could not retrieve submission.');
                } else {
                    resolve(dbSubmission);
                }
            });
        } else {
            resolve(new this({ username: username }));
        }
    });
});

// increase version on update
SubmissionSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $inc: { __v: 1 } });
    next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
