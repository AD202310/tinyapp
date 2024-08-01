const express = require('express');
const router = express.Router();

const { urlDatabase } = require('../database/initial_db');

// Link to longURL
router.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (id === undefined) {
    res.status(403);
    return res.send('403 - URL does not exist');
  }
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

module.exports = router;    