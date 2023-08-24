import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import { activityRouter } from './routes/activity.route';
import { activityTypesRouter } from './routes/activityTypes.route';
import { authRouter } from './routes/auth.route';
import { exercisesRouter } from './routes/exercises.route';
import { usersRouter } from './routes/users.route';

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/gorilla-gains-db')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err.message));

app.use(express.json(), express.urlencoded({ extended: true }));

app.use('/api/activityTypes', activityTypesRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/activity', activityRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
