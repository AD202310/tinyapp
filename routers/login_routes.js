const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const getUserByEmail = require('../handlers/getUserByEmail');
const users = require('../database/initial_db');

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
      res.status(403);
      return res.send('403 - Wrong password');
    }
  } else {
    res.status(403);
    return res.send('403 - Email address is not registered');
  }
});

module.exports = router;