const { assert } = require('chai');

const getUserByEmail = require('../handlers/getUserByEmail');

const testUsers = {
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
};

describe('Get user by email handler function', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("a@a.com", testUsers);
    const expectedUserID = testUsers.aa;
    assert.equal(user, expectedUserID);
  });


  it('Return undefined if non-existent email', () => {
    const user = getUserByEmail('nonexistent@example.com', testUsers);
    assert.equal(user, undefined);
  });

});