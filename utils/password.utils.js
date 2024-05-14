const bcrypt = require('bcrypt');

module.exports.bryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};
