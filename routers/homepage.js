const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { 
  console.log('Homepage Sesssion: ', req.session.user_id);   // TO BE REMOVED 
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;