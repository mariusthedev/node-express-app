const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const registerUser = async (req, res) => {
    
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            "message": "Username and/or password not provided"
        });
    }

    const duplicateUsername = await userModel.findOne({ username: username }).exec();
    if (duplicateUsername) {
        return res.sendStatus(409); // Conflict
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserResult = await userModel.create({
            "username": username,
            "password": hashedPassword
        });
        res.status(201).json({ "message": `New user ${username} created` });

    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { registerUser }