const nodemailer = require('nodemailer');
const { logger } = require('../util/winston');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    port: 25,
    host: 'localhost',
    tls: {
        rejectUnauthorized: false,
    },
    //secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
    // auth: {
    // 	user: process.env.EMAIL_SMTP_USERNAME,
    // 	pass: process.env.EMAIL_SMTP_PASSWORD
    // }
});

const { constants } = require('./constants');

exports.send = function (from, to, subject, html) {
    // send mail with defined transport object
    // visit https://nodemailer.com/ for more options
    return transporter.sendMail({
        from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
        to: to, // list of receivers e.g. bar@example.com, baz@example.com
        subject: subject, // Subject line e.g. 'Hello ✔'
        //text: text, // plain text body e.g. Hello world?
        html: html, // html body e.g. '<b>Hello world?</b>'
    });
};

exports.sendNotification = function (submission) {
    let sampleIdsString = '';
    submission.gridValues.map((element) => {
        sampleIdsString += `<br> ${element.userId}`;
    });
    let email = {
        subject: `[IGO Submission] ${submission.formValues.serviceId}`,
        content: `The following ${submission.formValues.material} samples were submitted to IGO for ${submission.formValues.application} by ${submission.username} under service id ${submission.formValues.serviceId}.  <br> ${sampleIdsString} `,
        footer:
      '<br><br><br>Thank you, <br><br><a href="http://cmo.mskcc.org/cmo/igo/">Integrated Genomics Operation</a><br><a href="https://www.mskcc.org">Memorial Sloan Kettering Cancer Center</a><br>T 646.888.3765<br>Follow us on <a href="https://www.instagram.com/genomics212/?hl=en">Instagram</a> and <a href="https://twitter.com/genomics212?lang=en">Twitter</a>!<br>',
    };
    // // send mail with defined transport object
    // // visit https://nodemailer.com/ for more options
    logger.log('info', `${email} sent to recipients.`);
    return transporter.sendMail({
        from: process.env.IGO_EMAIL, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
        to: 'wagnerl@mskcc.org, lisa.wagner91@gmail.com', // list of receivers e.g. bar@example.com, baz@example.com
        subject: email.subject, // Subject line e.g. 'Hello ✔'
        //text: text, // plain text body e.g. Hello world?
        html: email.content + email.footer, // html body e.g. '<b>Hello world?</b>'
    });
};

exports.sendToPms = (submissionFormValues) => {
    let isPmApp = constants.cmoPmEmailApplications.includes(
        submissionFormValues.application
    );
    let isHuman = submissionFormValues.species === 'Human';
    if (isHuman && isPmApp) {
        return true;
    } else return false;
};
