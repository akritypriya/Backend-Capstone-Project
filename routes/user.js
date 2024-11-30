const express = require("express");
const router = express.Router();
const User = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


router.post("/register", async (req, res) => {
    const { name, email, password, mobile } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(400).json({ message: "User already exist" });
    }
    
    //bcrypt.hash-> its hashing or encrypting the password to make it more secure
    //bcrypt.genSalt(10)-> ite encrypting the password to time
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);  // in db it will not be the original it will some random string
    
    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
        });
        res.status(200).json({ message: "User created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in creating user" });
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
   
    if (!user) {
        return res.status(400).json({ message: "Wrong username or password" });
    }
    //comparing the password provided by user while login
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Wrong username or password" });
    }
    //jasonwebtoken->to recognise the user logged in from non logged in user
    const payload = {   
        id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ token }); //token is created by payload and jwtsecret
})
module.exports = router;



// read about JWTs authentication method  (https://auth0.com/docs/secure/tokens/json-web-tokens)
// do login and register