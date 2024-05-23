const nodemailer = require('nodemailer');
const { logger } = require('../util/winston');
const { emailConfig } = require('./constants');

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

exports.sendNotification = function (submission) {
    let recipients = [emailConfig.notificationRecipients];

    let sampleIdsString = '';
    submission.gridValues.map((element) => {
        sampleIdsString += `<br> ${element.userId}`;
    });

    if (sendToPms(submission.formValues)) {
        recipients.push(emailConfig.cmoPmEmail);
    }
    if (sendToSingleCellTeam(submission.formValues)) {
        recipients.push(emailConfig.singleCellTeamEmail);
    }
    let email = {
        subject: `${emailConfig.subject} ${submission.formValues.serviceId}`,
        content: `The following ${submission.formValues.material} samples were submitted to IGO for ${submission.formValues.application} by ${submission.username} under service id ${submission.formValues.serviceId}.  <br> ${sampleIdsString} `,
        footer: emailConfig.footer,
    };
    console.log(email);

    logger.log('info', `${email} sent to recipients.`);
    transporter
        .sendMail({
            from: emailConfig.notificationSender, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
            to: recipients.join(','), // list of receivers e.g. bar@example.com, baz@example.com
            subject: email.subject, // Subject line e.g. 'Hello ✔'
            html: email.content + email.footer, // html body e.g. '<b>Hello world?</b>'
            //text: text, // plain text body e.g. Hello world?
        })
        // .then((result) => console.log(result))
        .catch((error) => console.log(error));
};

exports.sendDMPSubNotification = function (submission) {
    let recipients = [emailConfig.notificationDMPRecipients];

    let subject = `${emailConfig.DMPsubject}`;
    let serviceIdText = '';
    let serviceId = submission.formValues.serviceId;
    if (serviceId && serviceId.length > 0) {
        subject = `${emailConfig.DMPsubject} ${serviceId}`;
        serviceIdText = ` under service id ${serviceId}`;
    }

    let sampleIdsString = '';
    let projectTitles = [];
    submission.gridValues.map((element) => {
        if (element.molecularPathologyAccessionNumber && element.molecularPathologyAccessionNumber.length > 0) {
            sampleIdsString += `<br> ${element.molecularPathologyAccessionNumber}`;
        } else {
            sampleIdsString += `<br> ${element.dmpSampleId}`;
        }

        if (!projectTitles.includes(element.projectTitle)) {
            projectTitles.push(element.projectTitle);
        }
    });
    const projectTitlesString = projectTitles.join(', ');

    let email = {
        subject: `${subject}`,
        content: `The following ${submission.gridValues.length} ${submission.formValues.material} samples were submitted for transfer from DMP to IGO for ${submission.formValues.application} by ${submission.username}${serviceIdText} for the project(s) titled: ${projectTitlesString}.  <br> ${sampleIdsString} `,
        footer: emailConfig.footer,
    };
    console.log(email);

    logger.log('info', `${email} sent to recipients.`);
    transporter
        .sendMail({
            from: emailConfig.notificationSender, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
            to: recipients.join(','), // list of receivers e.g. bar@example.com, baz@example.com
            subject: email.subject, // Subject line e.g. 'Hello ✔'
            html: email.content + email.footer, // html body e.g. '<b>Hello world?</b>'
            //text: text, // plain text body e.g. Hello world?
        })
        // .then((result) => console.log(result))
        .catch((error) => console.log(error));
};

const sendToPms = (submissionFormValues) => {
    let isPmApp = emailConfig.cmoPmEmailApplications.includes(submissionFormValues.application);
    let isHuman = submissionFormValues.species === 'Human';
    if (isHuman && isPmApp) {
        return true;
    } else return false;
};

const sendToSingleCellTeam = (submissionFormValues) => {
    let isSingleCellApp = emailConfig.singleCellEmailApplications.includes(submissionFormValues.application);
    let notLibraryOrPool = !(submissionFormValues.material === 'DNA/cDNA Library' || submissionFormValues.material === 'Pooled Library');
    if (isSingleCellApp && notLibraryOrPool) {
        return true;
    } else return false;
};

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
