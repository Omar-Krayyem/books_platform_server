const express = require("express")
const app = express();
require("dotenv").config()
const mongoDb = require("./configs/mongodb.connection");

app.use(express.json())



app.listen(process.env.PORT, (err) => {
    if (err) {
      throw err
    }
    console.log("server is running on port: ", 5000)
    mongoDb()
})