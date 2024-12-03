const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;  // check for auth token
    if (!token) { //if token not provided
        return res.status(401).json({ message: "This action is not allowed" });
    }
    try { 
        //verfiy ()->verifies the token authentication ,after the verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //add the user
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = authMiddleware;
