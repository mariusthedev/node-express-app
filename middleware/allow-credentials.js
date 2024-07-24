const allowedOrigins = require('../config/allowed-origins');

const credentials = (req, res, next) => {
    const requestOrigin = req.header.origin;
    if (allowedOrigins.includes(requestOrigin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }

    next();
}

module.exports = credentials;