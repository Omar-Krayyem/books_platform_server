const express = require("express");
const router = express.Router()
const userControllers = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware")

router.put("/:id/follow", authMiddleware, userControllers.FollowUser);
router.put("/:id/unfollow", authMiddleware, userControllers.UnfollowUser)

module.exports = router