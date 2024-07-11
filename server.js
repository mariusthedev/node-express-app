const cors = require('cors')
const express = require('express')
const path = require('path')
const errorHandler = require('./middleware/error-handler')
const { logger } = require('./middleware/log-events')

const PORT_NUMBER = process.env.PORT || 8080
const WHITELIST = ['https://www.google.com']
const PATH_PUBLIC = path.join(__dirname, '/public')
const PATH_404 = path.join(__dirname, 'views', '404.html')
const server = express()

// Custom middleware logging
server.use(logger)

// CORS middleware (Cross Origin Resource Sharing)
let options = {
    origin: (origin, callback) => {
        if (WHITELIST.indexOf(origin) !== -1  || !origin) { // Origin domain is whitelisted (or no origin/undefined)
            callback(null, true) // Callback is allowed
        } else {
            callback(new Error('Callback to origin domain not allowed'))
        }
    },
    optionsSuccessStatus: 200
}
server.use(cors(options))

// Express middleware to handle URL-encoded data 
// 'content-type: application/x-www-form-urlencoded'
server.use(express.urlencoded({
    extended: false
}))

// Express middleware to handle JSON data
server.use(express.json())

// Express middleware to server static files from custom folders
server.use('/', express.static(PATH_PUBLIC)) 
server.use('/sub', express.static(PATH_PUBLIC))

// Custom routing from separate JS files
server.use('/', require('./routes/home'))
server.use('/sub', require('./routes/sub'))
server.use('/customers', require('./routes/api/customers'))

// Wildcard routing (all methods)
server.all('*', (req, res) => {
    console.log('called wildcard, returning and serving 404')
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(PATH_404)
    } else if (req.accepts('json')) {
        res.json({
            error: "404 not found"
        })
    } else {
        res.type('txt').send('404 not found')
    }
})

// Express error handling
server.use(errorHandler)

server.listen(PORT_NUMBER, () => {
    console.log(`server listening ${PORT_NUMBER}`)
})