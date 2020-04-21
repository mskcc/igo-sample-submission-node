var express = require("express");
var uploadRouter = require("./upload");
var submissionRouter = require("./submission");
const { authenticate } = require("../middlewares/jwt");
var apiResponse = require("../util/apiResponse");
var app = express();

// routes to be separated into
// submit, promote, download, user, dmp?

app.use("/upload/", authenticate, uploadRouter);
app.use("/submission/",authenticate, submissionRouter);

module.exports = app;
