import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import { ApiEndpoints } from './enum/apiEndpoints.enum';
import { activitiesSummaryRouter } from './routes/activitiesSummary.route';
import { activityRouter } from './routes/activity.route';
import { activityTypesRouter } from './routes/activityTypes.route';
import { authRouter } from './routes/auth.route';
import { exercisesRouter } from './routes/exercises.route';
import { usersRouter } from './routes/users.route';

const app = express();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

mongoose
  .connect(process.env.MONGO_DB as string)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err.message));

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', exposedHeaders: 'Authorization' }));

app.use(ApiEndpoints.ACTIVITY_TYPES_BASE, activityTypesRouter);
app.use(ApiEndpoints.EXERCISES_BASE, exercisesRouter);
app.use(ApiEndpoints.ACTIVITY_BASE, activityRouter);
app.use(ApiEndpoints.USERS_SUMMARY_ACTIVITIES_BASE, activitiesSummaryRouter);
app.use(ApiEndpoints.USERS_BASE, usersRouter);
app.use(ApiEndpoints.AUTH_BASE, authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
