import express from 'express';
import passport from 'passport';

import { ActivityPresetController } from '../controllers/activityPreset.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';
import { admin } from '../middleware/admin';

const activityPresetController = new ActivityPresetController();

export const activityPresetRouter = express.Router();

activityPresetRouter.get(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  activityPresetController.getUserActivityPresets
);
activityPresetRouter.post(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  activityPresetController.createActivityPreset
);

activityPresetRouter.delete(
  ApiEndpoints.ACTIVITY_PRESET_ID,
  [passport.authenticate('auth', { session: false }), admin],
  activityPresetController.deleteActivityPreset
);
