const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if(!token){
        return res.status(403).send({message: "No token provided"})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).send({ message: "Unauthorized!" });
        }

        req.userID = decoded.indexOf;
        next();
    })

}

const authJWT = {verifyToken};

module.exports = authJWT;