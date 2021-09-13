const jwt = require("jsonwebtoken");
const { readFile } = require("fs");
const { databaseFile, jwtSecret, jwtTokenexpiresInMinutes } = require("./config.json");

// Authenticate by username/email & password
function authenticate({ username, email, password }) {
  return new Promise((resolve, reject) => {
    // Read database file
    readFile(databaseFile, (err, data) => {
      if (err) reject(err);

      let jsonData = JSON.parse(data);

      // Find user from database file
      const user = jsonData.users.find(
        (u) =>
          (u.email === email || u.username === username) &&
          u.password === password
      );

      if (user) {
        // Return user with jwt token
        const token = jwt.sign({ sub: user.id }, jwtSecret, {
          expiresIn: jwtTokenexpiresInMinutes + "m",
        });
        const { password, ...userWithoutPassword } = user;
        resolve({
          ...userWithoutPassword,
          token,
        });
      } else {
        resolve(null);
      }
    });
  });
}

// Check if user is authenticated (Bearer token)
function isAuthenticated(req) {
  let token, decoded;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }

  return true;
}

module.exports = {
  authenticate,
  isAuthenticated,
};
