const { User } = require("../models/User");

let Auth = (req, res, next) => {
  // 토큰을 활용한 인증 처리
  // get token from client cookie
  let token = req.cookies.toughcookie;
  // decrypt token and find user - use method in User.js
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
  // if user exists - Auth ok
  // if user doesnt exist - Auth no
};

module.exports = { Auth };
