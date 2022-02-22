const { loggers } = require('winston');

const logger = loggers.get('logger');

exports.successResponse = function (res, msg) {
    var data = {
        status: 1,
        message: msg,
    };
    
    res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
    let user = res.user || {};
    var resData = {
        status: 1,
        message: msg,
        data: {
            ...data,
            user: user,
        },
    };
    res.status(200).json(resData);
};

exports.errorResponse = function (res, msg) {
    var data = {
        status: 0,
        message: 'Warning: ' + msg,
    };
    console.log(msg);
    

    res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
    var data = {
        status: 0,
        message: msg,
    };
    logger.log('error', msg);
    // console.log(data);
    res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
    var resData = {
        status: 0,
        message: msg,
        data: data,
    };
    logger.log('error', msg + data);
    res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
    var data = {
        status: 0,
        message: msg,
    };

    res.status(401).json(data);
};
