import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { ActivityTypesController } from '../controllers/activityTypes.controller';
import { admin } from '../middleware/admin';

const activityTypesController = new ActivityTypesController();

export const activityTypesRouter = express.Router();

activityTypesRouter.get('/', activityTypesController.getAllActivityTypes);
activityTypesRouter.post(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  activityTypesController.createActivityType
);
