const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    if (res.headersSent) {
        return next(); 
    }

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
   // console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err){
                console.log('error occurred...')
                console.log(err);
                return res.sendStatus(403); //invalid token
            } 
            console.log(req.userId );
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            req.userId = decoded.UserInfo.userId;
            next();
        }
    );
}

module.exports = verifyJWT