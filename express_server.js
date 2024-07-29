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







app.get('/', (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


// -----GET endpoints ----

app.get("/", (req, res) => {
  res.send("Hello!");
});

// My URLs page
app.get("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect("/login");
    return;
  }
  let filteredUrls = urlsForUser(req.session.user_id, urlDatabase);

  const templateVars = {
    urls: filteredUrls,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});


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

app.get("/register", (req, res) => {
  if (req.session.user_id !== undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { user: null};
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  if (req.session.user_id !== undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { user: null};
  res.render("urls_login", templateVars);
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



// Login
app.post("/login", (req, res) => {
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


// Logout
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/login');
});


// Registration page
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  let user_id = generateRandomUserID();
  for (let user in users) {
    if (email === users[user].email) {
      res.status(403);
      return res.send('403 - User already exists');
    }
    if (email === '' || password === '') {
      res.status(403);
      return res.send('403 - Email address or password is not entered');
    }
  }
  users[user_id] = {
    id: user_id,
    email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session.user_id = user_id;
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
