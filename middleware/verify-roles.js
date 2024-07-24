const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req?.roles) {
            return res.sendStatus(401); // Unauthorized
        }

        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        
        // Check if roles stored in request exists in 'allowedRoles' collection
        const result = req.roles
            .map(item => rolesArray.includes(item)) 
            .find(value => value === true); 
            
        if (!result) {
            return res.sendStatus(401);
        }

        next();
    }
}

module.exports = verifyRoles;