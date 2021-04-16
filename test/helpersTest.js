const { assert } = require('chai');

const { emailLookUp } = require('../helper');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailLookUp("user@example.com", users);
    const expectedOutput = "userRandomID";

    assert.equal(user.id, expectedOutput);
    
  });
  it('should return undefined', function() {
    const user = emailLookUp("", users);
    const expectedOutput = undefined;
    
    assert.equal(user.id, expectedOutput);
    
  });
});

