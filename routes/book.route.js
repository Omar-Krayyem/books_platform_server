const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/createBook", authMiddleware, bookControllers.createBook);
router.get("/getAll", authMiddleware, bookControllers.getAll);

router.post("/:bookId/like", authMiddleware, bookControllers.likeBook);
router.post("/:bookId/unlike", authMiddleware, bookControllers.unlikeBook);

module.exports = router