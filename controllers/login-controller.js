const bcrypt = require('bcrypt')

const usersDatabase = {
    users: require('../models/users.json'),
    initializeUserData: function (data) {
        this.users = data
    }
}

const loginUser = async (req, res) => {
    const {
        username, 
        password 
    } = req.body
    if (!username || !password) {
        return res.status(400).json({
            "message": "Username and/or password was not provided!"
        })
    }
    const foundUser = usersDatabase.users.find(item => item.username === username)
    if (!foundUser) {
        return res.sendStatus(401) // Unauthorized
    }
    // Evaluate password
    const matchedPassword = await bcrypt.compare(password, foundUser.password)
    if (matchedPassword) {
        // Create JWT (login and refresh)
        return res.json({
            "message": `User ${username} logged in!`
        })
    } else {
        return res.sendStatus(401)
    }
}

module.exports = { loginUser }