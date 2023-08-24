import express from 'express';
import passport from 'passport';

import { ActivityController } from '../controllers/activity.controller';

const activityController = new ActivityController();

export const activityRouter = express.Router();

activityRouter.get('/', activityController.getAllActivities);

activityRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  activityController.createActivity
);
