const express = require("express");
const app = express();

// default port 8080
const PORT = 8080; 

// Import third-party middleware
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");


// Import mock database
const { urlDatabase, users } = require('./database/initial_db');


// Import handlers
const { getUserByEmail } = require('./handlers/getUserByEmail');
const {generateRandomString, generateRandomUserID} = require('./handlers/generateRandom');
const { urlsForUser } = require('./handlers/urlsForUser');


// Import middleware
const session_handler = require('./middleware/session_handler');

// Import routers
const db_json = require('./development/db_json');
const homepage = require('./routers/homepage');
const urls_routes = require('./routers/urls_routes');
const register_routes = require('./routers/register_routes');
const login_routes = require('./routers/login_routes');



//View Engine setup
app.set("view engine", "ejs");


// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['foo', 'bar', 'boo'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Use middleware
app.use(session_handler);

// Development routers
app.use('/', db_json);

//Routes
app.use('/', homepage);
app.use('/', urls_routes);
app.use('/', register_routes);
app.use('/', login_routes);




// Create New URL
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
  return;
});


//Short URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[id].longURL,
    user: req.session.user_id
  };
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (id === undefined) {
    res.status(403);
    return res.send('403 - URL does not exist');
  }
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});





// ------- POST endpoints ---------

// Create New URL
app.post(`/urls`, (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`urls/${random}`);
});


// Delete in My URL page
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Update in My URL page
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect('/urls');
});











app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
