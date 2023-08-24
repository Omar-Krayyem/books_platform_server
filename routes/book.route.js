const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/createBook", authMiddleware, bookControllers.createBook);
router.get("/getAll", authMiddleware, bookControllers.getAll);

module.exports = router