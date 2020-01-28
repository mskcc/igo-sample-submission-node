var express = require("express");
var submitRouter = require("./submit");
var authRouter = require("./auth");

var app = express();

app.use("/auth/", authRouter);
app.use("/submit/", submitRouter);

module.exports = app;
