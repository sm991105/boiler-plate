const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://suemincho:2018suemin20!@boiler-plate-jqf59.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  // 익명함수
  res.send("The start of the boiler-plate project.");
});

app.listen(port, function () {
  console.log("Connected to port 3000!");
});
