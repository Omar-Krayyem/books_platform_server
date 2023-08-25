const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/getAll", authMiddleware, bookControllers.getAll);
router.get("/:bookId/book", authMiddleware, bookControllers.getBook);
router.get("/getRecommended", authMiddleware, bookControllers.getRecommended);
router.get("/search/:searching", bookControllers.searchBooks);

router.post("/:bookId/like", authMiddleware, bookControllers.likeBook);
router.post("/:bookId/unlike", authMiddleware, bookControllers.unlikeBook);
router.post("/createBook", authMiddleware, bookControllers.createBook);


module.exports = router