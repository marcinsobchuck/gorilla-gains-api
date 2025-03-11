import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { ActivityController } from '../controllers/activity.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';
import { admin } from '../middleware/admin';

const activityController = new ActivityController();

export const activityRouter = express.Router();

activityRouter.get(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  activityController.getAllActivities
);
activityRouter.get(
  ApiEndpoints.ACTIVITY_USER,
  [passport.authenticate('auth', { session: false })],
  activityController.getUserActivities
);
activityRouter.get(
  ApiEndpoints.ACTIVITY_USER_PRESETS,
  [passport.authenticate('auth', { session: false })],
  activityController.getUserActivityPresets
);
activityRouter.post(
  ApiEndpoints.ACTIVITY_USER_PRESETS,
  [passport.authenticate('auth', { session: false })],
  activityController.addActivityPreset
);
activityRouter.patch(
  ApiEndpoints.ACTIVITY_USER_PRESET_ID,
  [passport.authenticate('auth', { session: false })],
  activityController.removeActivityPreset
);
activityRouter.get(
  ApiEndpoints.ACTIVITY_USER_ID,
  [passport.authenticate('auth', { session: false })],
  activityController.getActivitiesPerUserId
);
activityRouter.post(
  '/',
  passport.authenticate('auth', { session: false }),
  activityController.createActivity
);
activityRouter.patch(
  ApiEndpoints.ACTIVITY_ACTIVITY_ID,
  passport.authenticate('auth', { session: false }),
  activityController.editActivityById
);
activityRouter.delete(
  ApiEndpoints.ACTIVITY_ACTIVITY_ID,
  passport.authenticate('auth', { session: false }),
  activityController.deleteActivity
);
