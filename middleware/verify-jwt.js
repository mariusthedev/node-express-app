const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.sendStatus(401)
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_SECRET,
        (error, decodedJwt) => {
            if (error) {
                return res.sendStatus(403) // Invalid JWT
            }
            req.username = decodedJwt.username
            next()
        }
    )
}

module.exports = verifyToken