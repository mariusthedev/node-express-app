const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const USERS_FILEPATH = path.join(__dirname, '..', 'models', 'users.json')

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function (data) {
        this.users = data
    }
}

const registerUser = async (req, res) => {
    
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            "message": "Username and/or password was not provided!"
        });
    }

    const duplicateUsername = usersDatabase.users.find(item => item.username === username);
    if (duplicateUsername) {
        return res.sendStatus(409); // Conflict
    }
    
    try {
        
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            "username": username,
            "roles": {
                "user": 300
            },
            "password": hashedPassword
        }
        
        // Write updates to simulated DB (JSON file)
        usersDatabase.initializeUserData([...usersDatabase.users, newUser]);
        await fsPromises.writeFile(
            USERS_FILEPATH, 
            JSON.stringify(usersDatabase.users));
        
        // Return to caller
        res.status(201).json({
            "message": `New user ${username} was created!`
        });

    } catch (error) {
        res.status(500).json({
            "message": error.message
        });
    }
}

module.exports = { registerUser }