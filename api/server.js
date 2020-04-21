const http = require("http");
const express = require("express");
var morgan = require("morgan");
var path = require("path");
var cors = require("cors");
require("dotenv").config();
var cookieParser = require('cookie-parser')


const winston = require("winston");

const { createLogger, format, transports, loggers } = require("winston");

const { combine, timestamp, label, prettyPrint } = format;

loggers.add("logger", {
    level: "info",
    format: combine(winston.format.json(), timestamp(), prettyPrint()),

    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const bodyparser = require("body-parser");
// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== "test") {
            console.log("Connected to %s", MONGODB_URL);
            console.log("App is running ... \n");
            console.log("Press CTRL + C to stop the process. \n");
        }
    })
    .catch(err => {
        console.error("App starting error:", err.message);
        process.exit(1);
    });
var db = mongoose.connection;

var port = 0;
const hostname = "127.0.0.1";
if (process.env.NODE_ENV !== "test") {
    port = 3002;
} else {
    port = 3003;
}

var publicDir = path.join(__dirname, "public");

var app = express();



app.use(cookieParser())
const jwtInCookie = require("jwt-in-cookie");
jwtInCookie.configure({ secret: process.env.JWT_SECRET });

// middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
const corsConfig = {
    origin: true,
    credentials: true,
};

//To allow cross-origin requests
app.use(cors(corsConfig));

if (process.env.NODE_ENV !== "test") {
    app.use(
        morgan(":method :url :status :res[content-length] - :response-time ms")
    );
}

var apiRouter = require("./routes/api");
var apiResponse = require("./util/apiResponse");


app.use("/api/", apiRouter);

app.get("/", function (req, res) {
    res.sendFile(path.join(publicDir, "index.html"));
});
app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(publicDir, "favicon.ico"));
});

app.use("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
});

// app.use((err, req, res, next) => {
//     if (err.name == "UnauthorizedError") {
//         return apiResponse.unauthorizedResponse(res, err.message);
//     }
//     console.log(req)
//     console.log(req.user)
// });

// app.use((req, res, next) => {
//     console.log(req)
//     console.log(req.user)
//     if (req.user){
//         res.user = req.user
//     }
//     next()
// });
// // throw 404 if URL not found
// app.all("*", function (req, res) {
//     return apiResponse.notFoundResponse(res, "Page not found");
// });

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = server;
