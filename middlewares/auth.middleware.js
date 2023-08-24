const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const authMiddleware = async (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).send({ message: 'Unauthorized' })

  try {
    const {_id}=jwt.verify(token, process.env.SECRET_KEY);
    const user= await User.findOne({_id})
    req.user=user
    next();

  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' })
  }

}

module.exports = authMiddleware