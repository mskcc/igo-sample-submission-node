var express = require("express");
var uploadRouter = require("./upload");
var authRouter = require("./auth");
var submissionRouter = require("./submission");
const { authenticate, getUser } = require("../middlewares/jwt");
var app = express();

// routes to be separated into
// submit, promote, download, user, dmp?

app.use("/auth/", authRouter);
app.use("/upload/", authenticate, uploadRouter);
app.use("/submission/", authenticate, submissionRouter);

module.exports = app;
