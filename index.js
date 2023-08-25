const express = require("express")
const app = express();
require("dotenv").config()
const mongoDb = require("./configs/mongodb.connection");
const cors = require("cors")
const multer = require('multer');
const path = require('path');

app.use(express.json())
app.use(cors())

app.use("/images", express.static(path.join(__dirname, "/images")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

const upload = multer({storage: storage});
app.post("/upload", upload.single("file"), (req, res) => {
    res
        .status(200)
        .json("File has been uploaded");
});

const authRoutes = require("./routes/auth.route")
app.use("/auth", authRoutes)
const bookRoutes = require("./routes/book.route")
app.use("/books", bookRoutes)
const userRoutes = require("./routes/users.route")
app.use("/users", userRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) {
      throw err
    }
    console.log("server is running on port: ", 5000)
    mongoDb()
})