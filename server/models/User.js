const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // sm991105 @ naver.com -> sm991105@naver.com
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// Encrypt the password before save using bcrypt
userSchema.pre("save", function (next) {
  var user = this; // Document.prototype (레코드 인가?)
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Define comparePassword method using bcrypt.compare
userSchema.methods.comparePassword = function (plainPassword, callback) {
  var user = this;
  bcrypt.compare(plainPassword, user.password, function (err, result) {
    if (err) return callback(err);
    callback(null, result); // null 과 result 를 가지고 뭘 할지는 함수를 호출할 때 정하는 것임
  });
};

// Define generateToken method using jsonwebtoken
userSchema.methods.generateToken = function (callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    callback(null, user);
  });
};

// Define findByToken method

userSchema.statics.findByToken = function (token, callback) {
  // Decrypt token;
  jwt.verify(token, "secretToken", function (err, decoded) {
    User.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      callback(null, user); // user정보 전달
    });
  });
};

var User = mongoose.model("User", userSchema);
module.exports = { User };
// User : userSchema 의 모델
