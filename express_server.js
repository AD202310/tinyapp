const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  aa: {
    id: "aa",
    email: "a@a.com",
    password: "11",
  },
  bb: {
    id: "bb",
    email: "b@b.com",
    password: "22",
  },
}

// --- functions


function generateRandomString() {
  let random = Math.random().toString(36).substr(2, 6);
  return random;
};

function generateRandomUserID() {
  let userID = Math.random().toString(36).substr(2, 6);
  return userID;
};

function findUserByEmail (email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
  return null;
};

function urlsForUser(id, database) {
  let filteredUrls = {};
  for (const shortURL in database) {
    if (database[shortURL].userID === id) {
      filteredUrls[shortURL] = database[shortURL];
    }
  }
  return filteredUrls;
};

// ---- DB Testers (delete when finish !!! )

app.get('/users.json', (req, res) => {
  res.json(users);
});

app.get('/db.json', (req, res) => {
  res.json(urlDatabase);
});





// -----GET endpoints ----

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  if (req.cookies["user_id"] === undefined) {
    res.redirect("/login");
    return;
  }
  const templateVars = { 
    urls: urlDatabase,
    user: req.cookies["user_id"] 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"] === undefined) {
    res.redirect("/login");
    return;
  }
  const templateVars = { 
    user: req.cookies["user_id"] 
  };
  res.render("urls_new", templateVars);
})

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  console.log('urlDatabase' ,urlDatabase)
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[id].longURL,
    user: req.cookies["user_id"]
   };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (id === undefined) {
    res.status(403);
    return res.send('403 - URL does not exist')
  };
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  if (req.cookies["user_id"] !== undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { user: null};
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies["user_id"] !== undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { user: null};
  res.render("urls_login", templateVars);
});


// ------- POST endpoints ---------


app.post(`/urls`, (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = { 
    longURL: req.body.longURL, 
    userID: req.cookies['user_id']
  } 
  res.redirect(`urls/${random}`);
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  console.log(urlDatabase)
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.status(403);
    return res.send('403 - Email address or password is not entered')
  }
  let result = findUserByEmail(email);
  if (result === null) {
    res.status(403)
    return res.send(`403 - Email address ${email} cannot be found`);
  }
  if (password === result.password) {
    res.cookie('user_id', result.id);
    res.redirect('/urls');
    return result;
  }
  res.status(403);
  return res.send('403 - Wrong password')
});

app.post("/logout", (req, res) => {
  const user = req.body.user;
  res.clearCookie ('user_id', user);
  res.redirect('/login');
});

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
      return res.send('403 - Email address or password is not entered')
    }
  }
  
  users[user_id] = {
    id: user_id,
    email,
    password
  }

  res.cookie('user_id', user_id)
  res.redirect('/urls');

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
