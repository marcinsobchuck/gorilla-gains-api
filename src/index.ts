import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import { usersRouter } from './routes/users';

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/gorilla-gains-db')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err.message));

app.use(express.json(), express.urlencoded({ extended: true }));
app.use('/api/users', usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
