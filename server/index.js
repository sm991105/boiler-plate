const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Auth } = require("./middleware/Auth");
const { User } = require("./models/User");
const mongoose = require("mongoose");
const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect database
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.log(err);
  });

// Homepage router
app.get("/", (req, res) => {
  res.send("The start of the boiler-project!");
});

// check if axios works
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

// Register router
app.post("/api/users/register", (req, res) => {
  var user = new User(req.body); // 새 레코드 생성
  // Mongoose 'save' method
  user.save((err) => {
    if (err) {
      res.json({ success: false, err });
    }
    res.json({ success: true }).status(200);
  });
});

// Login router
app.post("/api/users/login", (req, res) => {
  // Check if email exists in the database
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.json({ loginSuccess: false, message: "User not found" });
    }
    // If user is found, check password
    // Create method in the db document
    user.comparePassword(req.body.password, function (err, result) {
      if (err) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀립니다.",
        });
      }
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("toughcookie", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id, token: user.token });
      });
    });
  });
  console.log("Cookies: ", req.cookies.toughcookie);
});

// Auth router
app.get("/api/users/auth", Auth, (req, res) => {
  // auth 라는 미들웨어를 통해 진행 before executing callback function
  // 여기까지 통과했다면 Auth ok 라는 말
  // 그러면 어떤 페이지에서든지 유저정보를 req.user.doc 으로 조회/이용할 수 있다.
  res
    .status(200)
    .json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      email: req.user.email,
      name: req.user.name,
      image: req.user.image,
      role: req.user.role,
    })
    .send({ greetings: "hi" });
});

// Logout router
app.get("/api/users/logout", Auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Connected to port ${port}.`);
});

// User is a model
// const user = new User(req.body); user is a record
// user 은 사람 한 명, req.body(입력한내용)과 함께 레코드가 생성됨.
// 즉, User 은 데이터베이스, user 은 레코드 하나
