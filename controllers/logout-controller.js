const userModel = require('../models/user');

const logoutUser = async (req, res) => { // Frontend should delete the token
    const requestCookies = req.cookies;
    if (!requestCookies?.jwt) {
        return res.sendStatus(204); // No content
    }
    const cookieToken = requestCookies.jwt;
    const existingUser = await userModel.findOne({refreshToken: cookieToken}).exec();
    if (!existingUser) {
        res.clearCookie('jwt', { 
            httpOnly: true, // Disable JavaScript modification access
            secure: true,
            sameSite: 'None'
            // No need to set maxAge when deleting cookies
        });
        return res.sendStatus(204); // Successful (no content)
    }
    existingUser.refreshToken = '';
    const result = await existingUser.save(); // Save changes to MongoDB document
    res.clearCookie('jwt', { 
        httpOnly: true, // Disable JavaScript modification access
        //secure: true, // Testing locally, remove this for 'refreshToken' functionality
        sameSite: 'None'
        // No need for 'maxAge' when clearing cookie
    });  
    res.sendStatus(204);
}

module.exports = { logoutUser }