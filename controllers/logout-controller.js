require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;

const USERS_FILEPATH = path.join(__dirname, '..', 'models', 'users.json');

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function(data) { 
        this.users = data;
    }
}

const logoutUser = async (req, res) => { // Frontend should delete the JWT

    const requestCookies = req.cookies;
    if (!requestCookies?.jwt) {
        return res.sendStatus(204); // No content
    }
    
    const refreshToken = requestCookies.jwt;
    const existingUser = usersDatabase.users.find(item => item.refreshToken === refreshToken);
    
    if (!existingUser) {
        res.clearCookie('jwt', { 
            httpOnly: true, // Disable JavaScript modification access
            secure: true,
            sameSite: 'None'
            // No need to set maxAge when deleting cookies
        });
        return res.sendStatus(204); // Successful (no content)
    }
    
    // Delete refresh token from storage
    const otherUsers = usersDatabase.users.filter(item => item.username !== existingUser.username);
    const currentUserClearedToken = { 
        ...existingUser, 
        refreshToken: ''
    }
    usersDatabase.initializeUserData([...otherUsers, currentUserClearedToken]);
    await fsPromises.writeFile(USERS_FILEPATH, JSON.stringify(usersDatabase.users));
    res.clearCookie('jwt', { 
        httpOnly: true, // Disable JavaScript modification access
        secure: true,
        sameSite: 'None'
        // No need to set maxAge when deleting cookies
    });
    
    res.sendStatus(204);
}

module.exports = { logoutUser }