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
const { urlsForUser } = require('./handlers/urlsForUser');


// Import middleware
const session_handler = require('./middleware/session_handler');

// Import routers
const db_json = require('./development/db_json');
const homepage = require('./routers/homepage');
const urls_routes = require('./routers/urls_routes');
const register_routes = require('./routers/register_routes');
const login_routes = require('./routers/login_routes');
const long_urls_routes = require('./routers/long-urls_route');


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
app.use('/', long_urls_routes);

//Start server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
