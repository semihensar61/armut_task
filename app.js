const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

mongoose
  .connect(
    "mongodb://semihensar61:880861ts@ds147420.mlab.com:47420/semo-database",
    { useUnifiedTopology: true },
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:500000, timedout:1000 }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS" 
  );
  next();
});


app.listen(3000);

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/send_message", require("./routes/send"));
app.use("/block", require("./routes/block"));
app.use("/history", require("./routes/history"));

console.log("listen on 3000");

module.exports = app;
