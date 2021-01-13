const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const bodyparser = require('body-parser');
// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require('mongoose');
mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to %s', MONGODB_URL);
            console.log('App is running ... \n');
            console.log('Press CTRL + C to stop the process. \n');
        }
    })
    .catch((err) => {
        console.error('App starting error:', err.message);
        process.exit(1);
    });

var port = process.env.PORT;
const hostname = '127.0.0.1';

var publicDir = path.join(__dirname, 'public');

var app = express();

app.use(cookieParser());
const jwtInCookie = require('jwt-in-cookie');
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

if (process.env.NODE_ENV !== 'test') {
    app.use(
        morgan(function (tokens, req, res) {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'),
                '-',
                tokens['response-time'](req, res),
                'ms',
                '-',
                res.user ? res.user.username : 'anonymous',
            ].join(' ');
        })
    );
}

var apiRouter = require('./routes/api');
var apiResponse = require('./util/apiResponse');

app.use('/api/', apiRouter);

app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'));
});
app.get('/favicon.ico', function (req, res) {
    res.sendFile(path.join(publicDir, 'favicon.ico'));
});

app.use('*', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'));
    // return apiResponse.notFoundResponse(res, 'Page not found');
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = server;
