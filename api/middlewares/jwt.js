const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;

export const authenticate = jwt({
    secret: secret
});
