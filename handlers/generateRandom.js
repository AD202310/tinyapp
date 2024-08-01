
const generateRandomString = () => {
  let random = Math.random().toString(36).substr(2, 6);
  return random;
};


const generateRandomUserID = () => {
  let userID = Math.random().toString(36).substr(2, 6);
  return userID;
};

module.exports = { generateRandomString, generateRandomUserID };


