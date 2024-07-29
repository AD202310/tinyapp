
exports.generateRandomString = () => {
  let random = Math.random().toString(36).substr(2, 6);
  return random;
};


exports.generateRandomUserID = () => {
  let userID = Math.random().toString(36).substr(2, 6);
  return userID;
};


