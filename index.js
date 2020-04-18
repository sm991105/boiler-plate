const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

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
  res.send("The start of the boiler-plate project!");
});

// Register page -> new router with post method
app.post("/register", (req, res) => {
  // Get information from client and save it in DB
  const user = new User(req.body); // body-parser 로 인해 가능
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err }); // error 메시지와 함께 json 형식으로 전달
    return res.status(200).json({
      success: true,
    });
  }); // save 는 mongoDB method
});

app.listen(port, function () {
  console.log("Connected to port 3000!");
});
