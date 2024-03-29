var mongoose = require('mongoose');
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
var ObjectId = mongoose.Types.ObjectId;
const APP_VERSION = process.env.APP_VERSION;

var FormSchema = new mongoose.Schema({
    sharedWith: { type: String, default: '' },
    application: { type: String, required: true },
    capturePanel: { type: String, required: false },
    material: { type: String, required: true },
    numberOfSamples: { type: Number, required: true },
    serviceId: { type: String, required: true },
});

var DmpSubmissionSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        formValues: FormSchema,
        gridValues: { type: Array, required: true },
        approvals: { type: Number, default: 0, required: false },
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Number, required: false },
        reviewed: { type: Boolean, default: false },
        reviewedAt: { type: Number, required: false },
        reviewedBy: { type: String, required: false },
        isAvailableAtDmp: { type: Boolean, default: false },
        dmpTrackingId: { type: String, required: false },
        transactionId: { type: Number, required: false },
        appVersion: { type: String, default: APP_VERSION },
        // grr, adding this id is bad style since it should by rights belong in a relational DB
        // adding DMP submissions made it necessary/convenient
        relatedIgoSubmission_id: { type: mongoose.Types.ObjectId, required: false },
        loadedFromDmpAt: { type: Number, required: false },
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

DmpSubmissionSchema.static('findOrCreateSub', function (id, username) {
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
DmpSubmissionSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $inc: { __v: 1 } });
    next();
});

module.exports = mongoose.model('DmpSubmission', DmpSubmissionSchema);
