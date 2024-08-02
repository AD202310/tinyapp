const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { 
  console.log(req.session.user_id); 
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;