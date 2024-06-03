const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connection to mongodb'));

db.once('open', () => {
  console.log('Successfully connected to database');
});

module.exports = db;
