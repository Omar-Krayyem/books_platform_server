const express = require("express")
const app = express();
require("dotenv").config()
const mongoDb = require("./configs/mongodb.connection");
const cors = require("cors")


app.use(express.json())
app.use(cors())

const authRoutes = require("./routes/auth.route")
app.use("/auth", authRoutes)
const bookRoutes = require("./routes/book.route")
app.use("/books", bookRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) {
      throw err
    }
    console.log("server is running on port: ", 5000)
    mongoDb()
})