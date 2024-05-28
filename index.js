import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

require('./config/mongoose');

dotenv.config();

const app = express();
const { PORT } = process.env;
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Yup, express server is running on port: ${PORT}`);
});
