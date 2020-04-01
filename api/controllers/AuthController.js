const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../util/apiResponse");
const helpers = require("../util/helpers");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
// const mailer = require("../helpers/mailer");
// const { constants } = require("../helpers/constants");

/**
 * User login.
 *
 * @param {string}      username
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
    body("username")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Username must be specified."),
    body("password")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Password must be specified."),
    sanitizeBody("username").escape(),
    sanitizeBody("password").escape(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(
                    res,
                     "Validation error.",
                    errors.array()
                );
            } else {
                axios
                    // .post("https://igodev.mskcc.org/auth/login", {
                    .post("http://localhost:8500/login", {
                        username: req.body.username,
                        password: req.body.password,
                        token: process.env.AUTH_TOKEN
                    })
                    .then(response => {
                        UserModel.findOne({
                            username: response.data.username
                        }).then(user => {
                            if (user) {
                                user.loginCounter += 1;
                                user.role = helpers.determineRole(
                                    response.data.groups
                                );
                                user.groups = response.data.groups;
                            } else {
                                var user = new UserModel({
                                    username: response.data.username,
                                    fullName: response.data.full_name,
                                    role: helpers.determineRole(
                                        response.data.groups
                                    ),
                                    title: response.data.title,
                                    groups: response.data.groups,
                                    loginCounter: 1
                                });
                            }
                            user.save(err => {
                                if (err) {
                                    return apiResponse.ErrorResponse(res, err);
                                } else {
                                    let userData = {
                                        fullName: user.fullName,
                                        username: user.username,
                                        role: user.role
                                    };
                                    //Prepare JWT token for authentication
                                    const jwtPayload = userData;
                                    const jwtData = {
                                        expiresIn:
                                            process.env.JWT_TIMEOUT_DURATION
                                    };
                                    const secret = process.env.JWT_SECRET;

                                    //Generated JWT token with Payload and secret.
                                    userData.token = jwt.sign(
                                        jwtPayload,
                                        secret,
                                        jwtData
                                    );

                                    return apiResponse.successResponseWithData(
                                        res,
                                        "Login Success.",
                                        userData
                                    );
                                }
                            });
                        });
                    })

                    .catch(error => {
                        if (error.response && error.response.status === 401) {
                            return apiResponse.unauthorizedResponse(
                                res,
                                "Invalid username or password. Please try again."
                            );
                        }else{
                            return apiResponse.ErrorResponse(error);                
                        }
                    });
            }
        } catch (err) {
            console("what")
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
