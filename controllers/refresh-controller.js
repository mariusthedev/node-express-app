require('dotenv').config();
const jwt = require('jsonwebtoken');

const USERS_FILEPATH = path.join(__dirname, '..', 'models', 'users.json');

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function (data) { 
        this.users = data;
    }
}

const refreshToken = (req, res) => {

    const requestCookies = req.cookies;
    if (!requestCookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }
    
    console.log(requestCookies.jwt) // For debugging
    const refreshToken = requestCookies.jwt;
    const foundUser = usersDatabase.users.find(item => item.refreshToken === refreshToken);
    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }
    
    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        (error, decodedJwt) => {
            if (err || foundUser.username !== decodedJwt.username) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                { "username": decodedJwt.username }, 
                process.env.ACCESS_SECRET, 
                { expiresIn: '60s' });
            res.json({
                accessToken
            });
        }
    );
}

module.exports = { refreshToken }