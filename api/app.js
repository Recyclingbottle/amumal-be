const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World with dotenv!");
});

module.exports = app;
