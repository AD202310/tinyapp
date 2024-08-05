const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const getUserByEmail = require('../handlers/getUserByEmail');
const { users } = require('../database/initial_db');

router.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  const templateVars = { user: null};
  res.render("urls_login", templateVars);
});


router.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email, users);
  if (user !== undefined) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect('/urls');
    } else {
      res.send('<script>alert("Wrong password"); window.location.href = "/"; </script>');
    }
  } else {
    res.send('<script>alert("Email address is not registered"); window.location.href = "/"; </script>');
  };
});

router.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/login');
});

module.exports = router;