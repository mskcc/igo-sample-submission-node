var mongoose = require('mongoose');
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
var ObjectId = mongoose.Types.ObjectId;

var FormSchema = new mongoose.Schema({
    sharedWith: { type: String, default: '' },
    application: { type: String, required: true },
    material: { type: String, required: true },
    numberOfSamples: { type: Number, required: true },
});

var DmpSubmissionSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        formValues: FormSchema,
        gridValues: { type: Array, required: true },
        // samplesApproved: { type: Number, default: 0 },
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Number, required: false },
        reviewed: { type: Boolean, default: false },
        reviewedAt: { type: Number, required: false },
        reviewedBy: { type: String, required: false },
        transactionId: { type: Number, required: false },
        appVersion: { type: String, default: '2.5' },
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
