const express = require('express');
const router = express.Router();

const { urlDatabase, users } = require('../database/initial_db')


router.get('/users.json', (req, res) => {
  res.json(users);
});

router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

module.exports = router;
