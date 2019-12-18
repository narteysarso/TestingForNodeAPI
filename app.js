const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
}); //loads .env
const express = require("express");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const isAuth = require("./middlewares/is-auth");


const app = express();

//General middlewares
app.use(bodyParser.json()); // this will parse json data from client
app.use("/images", express.static(path.join(__dirname, "images"))); //serves images folder statically
app.use((req, res, next) => {
  /** Enabling CORS */
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader(
    "Access-control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
  res.setHeader("Access-control-Allow-", "Content-Type, Authorization");

  next();
});


//Routes middlewares
app.use("/feed", [isAuth], feedRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.status(501).json({
    message: "Not Implemented"
  })
})
app.use((error, req, res, next) => {
  /**Error handling middleware */

  const {
    statusCode,
    message
  } = error;
  res.status(statusCode).json({
    message
  });
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => app.listen(8080))
  .catch(err => {
    console.log(err);
  });