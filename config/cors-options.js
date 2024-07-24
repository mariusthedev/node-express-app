const allowedOrigins = require('./allowed-origins');

const options = {
    
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1  || !origin) { // Origin domain is allowed (or no origin/undefined)
            callback(null, true); // Callback is allowed
        } else {
            callback(new Error('Callback to origin domain not allowed'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = options;