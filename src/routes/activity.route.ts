import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { ActivityController } from '../controllers/activity.controller';
import { admin } from '../middleware/admin';

const activityController = new ActivityController();

export const activityRouter = express.Router();

activityRouter.get(
  '/',
  [passport.authenticate('jwt', { session: false }), admin],
  activityController.getAllActivities
);
activityRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  activityController.createActivity
);
