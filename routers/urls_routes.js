const express = require('express');
const router = express.Router();

const { urlDatabase, users } = require('../database/initial_db');
const urlsForUser = require('../handlers/urlsForUser')


// Check session, filter urls related to the user
router.get("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect("/login");
    return;
  }
  let filteredUrls = urlsForUser.urlsForUser(req.session.user_id, urlDatabase);

  const templateVars = {
    urls: filteredUrls,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});


// Create New URL
router.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
  return;
});


//Short URL
router.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[id].longURL,
    user: req.session.user_id
  };
  res.render("urls_show", templateVars);
});





module.exports = router;