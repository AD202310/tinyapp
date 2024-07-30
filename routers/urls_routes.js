const express = require('express');
const router = express.Router();

const { urlDatabase, users } = require('../database/initial_db');
const urlsForUser = require('../handlers/urlsForUser')

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

module.exports = router;