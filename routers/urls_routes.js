const express = require('express');
const router = express.Router();

const { urlDatabase, users } = require('../database/initial_db');
const urlsForUser = require('../handlers/urlsForUser')
const { generateRandomString } = require('../handlers/generateRandom');


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


// Create New URL - check session
router.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
  return;
});


// Create New URL
router.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`urls/${random}`);
});


//Show short URL details
router.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[id].longURL,
    user: req.session.user_id
  };
  res.render("urls_show", templateVars);
});


// Delete in My URL page
router.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});


// Update in My URL page
router.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect('/urls');
});


module.exports = router;