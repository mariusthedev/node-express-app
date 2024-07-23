require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;

const USERS_FILEPATH = path.join(__dirname, '..', 'models', 'users.json');

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function (data) {
        this.users = data;
    }
}

const loginUser = async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 
            "message": "Username and/or password was not provided!" 
        });
    }

    const foundUser = usersDatabase.users.find(item => item.username === username);
    if (!foundUser) {
        return res.sendStatus(401); // Unauthorized
    }

    // Evaluate password
    const matchedPassword = await bcrypt.compare(password, foundUser.password)
    if (matchedPassword) {
        try {

            // Create JWTs
            const accessToken = jwt.sign(
                { "username": foundUser.username }, 
                process.env.ACCESS_SECRET, 
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username }, 
                process.env.REFRESH_SECRET, 
                { expiresIn: '60s' }
            );

            // Write updates to simulated DB (JSON file)
            const otherUsers = usersDatabase.users.filter(item => item.username !== foundUser.username);
            const currentUserWithRefreshToken = { 
                ...foundUser, 
                refreshToken 
            }
            usersDatabase.initializeUserData([...otherUsers, currentUserWithRefreshToken]);
            await fsPromises.writeFile(USERS_FILEPATH, JSON.stringify(usersDatabase.users));
            
            // Return to caller
            res.cookie(
                'jwt',
                refreshToken, {
                    httpOnly: true, // Disable JavaScript modification access
                    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
                }
            );
            res.json({ accessToken });
        } catch (error) {
            res.status(500).json({ 
                "message": error.message 
            });
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }