import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { ExercisesController } from '../controllers/exercises.controller';
import { admin } from '../middleware/admin';

const exercisesController = new ExercisesController();

export const exercisesRouter = express.Router();

exercisesRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  exercisesController.getExercisesPerActivityType
);
exercisesRouter.post(
  '/',
  [passport.authenticate('jwt', { session: false }), admin],
  exercisesController.createExercise
);
