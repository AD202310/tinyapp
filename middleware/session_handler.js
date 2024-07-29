
const session_handler = (req, res, next) => {
  res.locals.user_id = req.session.user_id || false;
  next();
};

module.exports = session_handler;