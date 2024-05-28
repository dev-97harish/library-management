const bcrypt = require('bcrypt');

module.exports.bryptPassword = (password) => bcrypt.hash(password, 10);
