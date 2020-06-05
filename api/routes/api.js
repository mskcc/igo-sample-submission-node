var express = require('express');
var uploadRouter = require('./upload');
var submissionRouter = require('./submission');
var promoteRouter = require('./promote');
var dmpRouter = require('./dmp');
const { authenticate } = require('../middlewares/jwt');
var app = express();

// routes to be separated into
// submit, promote, download, user, dmp?

app.use('/upload/', authenticate, uploadRouter);
app.use('/submission/', authenticate, submissionRouter);
app.use('/promote/', authenticate, promoteRouter);
app.use('/dmp/', authenticate, dmpRouter);
// app.use('/upload/',  uploadRouter);
// app.use('/submission/',  submissionRouter);
// app.use('/promote/',  promoteRouter);
// app.use('/dmp/',  dmpRouter);

module.exports = app;
