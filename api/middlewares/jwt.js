const jwtInCookie = require('jwt-in-cookie');

const apiResponse = require('../util/apiResponse');
exports.authenticate = function (req, res, next) {
  try {
    let user = jwtInCookie.validateJwtToken(req);
    // req.user = user
    res.user = user;
    res.user.role = determineRole(user);
  } catch (err) {
    return apiResponse.unauthorizedResponse(res, 'Invalid session');
  }
  next();
};

const determineRole = (user) => {
  if (user.isAdmin) {
    return 'admin';
  }
  if (user.isLabMember) {
    return 'lab_member';
  }
  if (user.isUser) {
    return 'user';
  }
};
