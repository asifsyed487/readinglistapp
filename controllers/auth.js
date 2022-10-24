const jwt = require("jsonwebtoken"); // to generate signed token
const bcrypt = require("bcrypt");
const expressJwt = require("express-jwt"); // for auth check
const { errorHandler } = require("../helpers/dbErrorHandler");
const uuid = require("uuid");
const pool = require("../config/db");

require("dotenv").config();

exports.userById = async (req, res, next, id) => {
  // find the user based on user_unique_id
  const getUser = await pool.query(
    "SELECT * from users WHERE user_unique_id=$1",
    [id]
  );
  if (getUser.rows.length > 0) {
    getUser.rows[0].password = undefined;
    req.profile = getUser.rows[0];
    next();
  } else {
    return res.status(400).json({
      error: "User not found",
    });
  }
};

exports.signup = async (req, res) => {
  const user_unique_id = uuid.v4();

  await bcrypt.hash(req.body.password, 10, async (err, hash) => {
    const createUser = await pool
      .query(
        "INSERT INTO users(user_unique_id, fullname, email, password) VALUES($1, $2, $3, $4) RETURNING *",
        [user_unique_id, req.body.fullname, req.body.email, hash]
      )
      .then((data) => {
        // console.log(data);
        data.rows[0].password = undefined; // for the privacy of password
        res.json({ data: data.rows[0] });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      });
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  // find the user based on email
  const getUser = await pool.query("SELECT * from users WHERE email=$1", [
    email,
  ]);
  if (getUser.rows.length > 0) {
    // if user found make sure the email and password match
    if (bcrypt.compareSync(password, getUser.rows[0].password)) {
      // generate a signed token with user id and secret
      const token = jwt.sign(
        { _id: getUser.rows[0].user_unique_id },
        process.env.JWT_SECRET
      );
      // persist the token as 't' in cookie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { user_unique_id, fullname, email } = getUser.rows[0];
      return res.json({ token, user: { user_unique_id, fullname, email } });
    } else {
      return res.status(400).json({
        error: "password doesn't match",
      });
    }
  } else {
    return res.status(400).json({
      error: "user with that email doesn't exist. please signup.",
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  // algorithms: ['RS256'],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user =
    req.profile && req.auth && req.profile.user_unique_id == req.auth._id;
  console.log("req.profile.user_unique_id");
  console.log(req.profile.user_unique_id);
  console.log("req.auth._id");
  console.log(req.auth._id);
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
