const WHITELIST = [
    'https://www.google.com',
    'http://127.0.0.1:8080',
    'http://localhost:3500'
]

const options = {
    origin: (origin, callback) => {
        if (WHITELIST.indexOf(origin) !== -1  || !origin) { // Origin domain is whitelisted (or no origin/undefined)
            callback(null, true) // Callback is allowed
        } else {
            callback(new Error('Callback to origin domain not allowed'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = options