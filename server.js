require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');

const dbConnect = require('./config/db-connect');
const corsOptions = require('./config/cors-options');
const errorHandler = require('./middleware/error-handler');
const verifyToken = require('./middleware/verify-jwt');
const allowCredentials = require('./middleware/allow-credentials');
const { logger } = require('./middleware/log-events');

const PORT_NUMBER = process.env.PORT || 8080;
const PATH_PUBLIC = path.join(__dirname, '/public');
const PATH_404 = path.join(__dirname, 'views', '404.html');
const server = express();

// Attempt connecting to database
dbConnect();

// Custom middleware logging
server.use(logger);

// Handle options credentials check (before CORS), get cookies credentials requirement
server.use(allowCredentials);

// CORS middleware (Cross Origin Resource Sharing)
server.use(cors(corsOptions));

// Express middleware to handle URL-encoded data 
// 'content-type: application/x-www-form-urlencoded'
server.use(express.urlencoded({
    extended: false
}));

// Express middleware to handle JSON data
server.use(express.json());

// Middleware for parsing cookies (duh)
server.use(cookieParser());

// Express middleware to serve static files from custom folders
server.use('/', express.static(PATH_PUBLIC));

// Custom "waterfall" routing & middleware injection
server.use('/', require('./routes/home'));
server.use('/register', require('./routes/register'));
server.use('/login', require('./routes/login'));
server.use('/refresh', require('./routes/refresh'));
server.use('/logout', require('./routes/logout'));

server.use(verifyToken); // Routes after this statement requires signed JWT
server.use('/customers', require('./routes/api/customers'));

// Wildcard routing (all methods)
server.all('*', (req, res) => {
    console.log('[CONSOLE_LOG] Wildcard route return and serve 404');
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(PATH_404);
    } else if (req.accepts('json')) {
        res.json({
            error: "404 not found"
        });
    } else {
        res.type('txt').send('404 not found');
    }
})

// Express error handling
server.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log('[CONSOLE_LOG] Database connection open');
    server.listen(PORT_NUMBER, () => {
        console.log(`[CONSOLE_LOG] Server listening on port ${PORT_NUMBER}`);
    });
});