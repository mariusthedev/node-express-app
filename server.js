const cors = require('cors')
const corsOptions = require('./config/cors-options')
const path = require('path')
const express = require('express')
const errorHandler = require('./middleware/error-handler')
const { logger } = require('./middleware/log-events')

const PORT_NUMBER = process.env.PORT || 8080
const PATH_PUBLIC = path.join(__dirname, '/public')
const PATH_404 = path.join(__dirname, 'views', '404.html')
const server = express()

// Custom middleware logging
server.use(logger)

// CORS middleware (Cross Origin Resource Sharing)
server.use(cors(corsOptions))

// Express middleware to handle URL-encoded data 
// 'content-type: application/x-www-form-urlencoded'
server.use(express.urlencoded({
    extended: false
}))

// Express middleware to handle JSON data
server.use(express.json())

// Express middleware to serve static files from custom folders
server.use('/', express.static(PATH_PUBLIC))

// Custom routing from separate JS files
server.use('/', require('./routes/home'))
server.use('/register', require('./routes/register'))
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