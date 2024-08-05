const express = require('express');
const router = express.Router();

const random = require('../handlers/generateRandom');
const { users } = require('../database/initial_db');

const bcrypt = require("bcryptjs");


router.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  
  const templateVars = { user: null};
  res.render("urls_register", templateVars);
});


router.post("/register", (req, res) => {
  const { email, password } = req.body;
  
  let user_id = random.generateRandomUserID();
  


  for (let user in users) { 

    if (email === users[user].email) {
      res.status(403);
      return res.send('<script>alert("User already exists"); window.location.href = "/"; </script>');
    }
    if (email === '' || password === '') {
      res.status(403);
      return res.send('<script>alert("Email address or password is not entered"); window.location.href = "/"; </script>');
    }
  }
  
  users[user_id] = {
    id: user_id,
    email: email,
    password: bcrypt.hashSync(req.body.password, 10)
  };

  req.session.user_id = user_id;
  res.redirect('/urls');
});


module.exports = router;
