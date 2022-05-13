require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(cookieParser());
require("./data/sudoku-db");

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.get("/", (req, res) => {
  res.json({ motd: "ssshhhhhh" });
});

app.post("/add", (req, res) => {
  console.log(req.body);
  res.json({ result: req.body.a + req.body.b });
});

app.get("/random", (req, res) => {
  res.json({ random: Math.random() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//----  AUTH ROUTES
const checkAuth = require("./middleware/checkAuth");
app.use(checkAuth);
const User = require("./models/user");
const jwt = require("jsonwebtoken");

//-----------------log in
app.post("/login", (req, res) => {
  const { username, password} = req.body;
  // Find this user name
  User.findOne({ username }, "username password")
    .then((user) => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      user.comparePassword(password, (err, isMatch) => {
        // Check the password
        if (!isMatch) {
          return res
            .status(401)
            .send({ message: "Wrong Username or password" }); // Password does not match
        }
        // Create a token
        const token = jwt.sign(
          { _id: user._id, username: user.username },
          process.env.SECRET,
          {
            expiresIn: "30 hours",
          }
        );
        //   return res.json('/');
        res.json({ token });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/:id", (req, res) => {
    const id = req.params.id
    console.log(id)
    User.findById(id)
    .then(user => {
        res.json({user})
    })
    .catch(err => console.log(err))
})

// -----SIGN UP POST
app.post("/sign-up", (req, res) => {
  // Create User and JWT
  console.log(req.body);
  const user = new User(req.body);
  user.save().then(() => {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "60 days",
    });
    res.json({ token });
    return console.log("THING HAPPENED");
  });


});
