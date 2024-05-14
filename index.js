const express = require('express');
const dotenv = require('dotenv');
require('./config/mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes'));

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Yup, express server is running on port: ${PORT}`);
});
