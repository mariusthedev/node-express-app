const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({"message": "Username and/or password not provided"});
    }
    const existingUser = await userModel.findOne({username: username}).exec();
    if (!existingUser) {
        return res.sendStatus(401); // Unauthorized
    }
    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (matchedPassword) {
        try {
            const existingUserRoles = Object.values(existingUser.roles);
            const accessToken = jwt.sign(
                {
                    "claims": {
                        "username": existingUser.username,
                        "roles": existingUserRoles
                    }
                },
                process.env.ACCESS_SECRET, 
                {expiresIn: '15m'}
            );
            const refreshToken = jwt.sign(
                {"username": existingUser.username}, 
                process.env.REFRESH_SECRET, 
                {expiresIn: '1d'}
            );
            existingUser.refreshToken = refreshToken;
            const result = await existingUser.save(); // Save changes to MongoDB document
            res.cookie(
                'jwt',
                refreshToken, {
                    httpOnly: true, // Disable JavaScript modification access
                    //secure: true, // Testing locally, remove this for 'refreshToken' functionality
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                }
            );
            res.json({accessToken});
        } catch (error) {
            res.status(500).json({"message": error.message});
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }