
exports.urlsForUser = (id, database) => {
  let filteredUrls = {};
  for (const shortURL in database) {
    if (database[shortURL].userID === id) {
      filteredUrls[shortURL] = database[shortURL];
    }
  }
  return filteredUrls;
};
