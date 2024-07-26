const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const refreshToken = async (req, res) => {
    const requestCookies = req.cookies;
    if (!requestCookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }  
    const cookieJwt = requestCookies.jwt;
    const existingUser = await userModel.findOne({refreshToken: cookieJwt}).exec();
    if (!existingUser) {
        return res.sendStatus(403); // Forbidden
    }
    jwt.verify(
        cookieJwt,
        process.env.REFRESH_SECRET,
        (error, decodedJwt) => {
            if (error || existingUser.username !== decodedJwt.username) {
                return res.sendStatus(403);
            }
            const existingUserRoles = Object.values(existingUser.roles);
            const accessToken = jwt.sign(
                {  
                    "claims": {
                        "username": decodedJwt.username,
                        "roles": existingUserRoles
                    }
                }, 
                process.env.ACCESS_SECRET, 
                {expiresIn: '1d'}
            );
            res.json({accessToken});
        }
    );
}

module.exports = {refreshToken}