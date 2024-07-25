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
            "message": "Username and/or password not provided" 
        });
    }

    const existingUser = usersDatabase.users.find(item => item.username === username);
    if (!existingUser) {
        return res.sendStatus(401); // Unauthorized
    }

    // Evaluate password
    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (matchedPassword) {
        try {

            const existingUserRoles = Object.values(existingUser.roles);

            // Create JWTs
            const accessToken = jwt.sign(
                {
                    "claims": {
                        "username": existingUser.username,
                        "roles": existingUserRoles
                    }
                },
                process.env.ACCESS_SECRET, 
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { "username": existingUser.username }, 
                process.env.REFRESH_SECRET, 
                { expiresIn: '1d' }
            );

            // Write updates to simulated DB (JSON file)
            const otherUsers = usersDatabase.users.filter(item => item.username !== existingUser.username);
            const currentUserWithRefreshToken = { 
                ...existingUser, 
                refreshToken 
            }
            usersDatabase.initializeUserData([...otherUsers, currentUserWithRefreshToken]);
            await fsPromises.writeFile(USERS_FILEPATH, JSON.stringify(usersDatabase.users));
            
            // Return to caller
            res.cookie(
                'jwt',
                refreshToken, {
                    httpOnly: true, // Disable JavaScript modification access
                    //secure: true, // When testing with ThunderClient, remove this for refreshToken functionality
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
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