const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");

const app = express();

//General middlewares
app.use(bodyParser.json()); // this will parse json data from client
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
app.use("/feed", feedRoutes);

app.listen(8080);
