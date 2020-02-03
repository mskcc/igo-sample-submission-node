var express = require("express");
var uploadRouter = require("./upload");
var authRouter = require("./auth");

var app = express();

app.use("/auth/", authRouter);
app.use("/upload/", uploadRouter);

module.exports = app;
