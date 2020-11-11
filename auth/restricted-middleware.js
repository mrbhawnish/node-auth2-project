const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./secrets');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'You shall not pass!' }); 
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // console.log('decoded error =>', err);
            return res.status(401).json({ message: "token err"})
        } 
        req.decodedJwt = decoded
        next()
    })
}