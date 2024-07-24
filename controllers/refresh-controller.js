require('dotenv').config();
const jwt = require('jsonwebtoken');

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function(data) { 
        this.users = data;
    }
}

const refreshToken = (req, res) => {

    const requestCookies = req.cookies;
    if (!requestCookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }
    
    const refreshToken = requestCookies.jwt;
    const existingUser = usersDatabase.users.find(item => item.refreshToken === refreshToken);
    if (!existingUser) {
        return res.sendStatus(403); // Forbidden
    }
    
    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        (error, decodedJwt) => {
            
            if (error || existingUser.username !== decodedJwt.username) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                { "username": decodedJwt.username }, 
                process.env.ACCESS_SECRET, 
                { expiresIn: '60s' }
            );
                
            res.json({ accessToken });
        }
    );
}

module.exports = { refreshToken }