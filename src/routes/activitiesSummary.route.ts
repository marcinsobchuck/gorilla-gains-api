import express from 'express';
import passport from 'passport';

import '../middleware/auth';
import { ActivitiesSummaryController } from '../controllers/activitiesSummary.controller';

const activitiesSummaryController = new ActivitiesSummaryController();

export const activitiesSummaryRouter = express.Router();

activitiesSummaryRouter.get(
  '/',
  [passport.authenticate('jwt', { session: false })],
  activitiesSummaryController.getSummary
);
