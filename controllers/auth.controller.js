const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, email, password } = req.body;

    console.log(req)

    try {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) return res.status(400).send({ message: "Username is already exist" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send({ message: "Email is already exist" });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ username, email }, process.env.SERCRET_KEY); // Passing user data directly

        res.send({ status: 201, token, message: "User created successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).send({ message: "Email and Password are required" })

    try {
    const user = await User.findOne({email}).lean()
    
    if (!user){
        return res.status(401).send({ message: "Email not found" })
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send({ message: "Email and Password are required" })
    const { password: hashedPassword, ...userInfo } = user

    const token =  jwt.sign(userInfo, process.env.SERCRET_KEY)
        return res.send({
            token,
            user: userInfo
        }) 
    
    }catch(err){
        console.err
    }

}

module.exports = { login, register }