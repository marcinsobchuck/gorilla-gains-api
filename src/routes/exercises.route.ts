import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { ExercisesController } from '../controllers/exercises.controller';
import { admin } from '../middleware/admin';

const exercisesController = new ExercisesController();

export const exercisesRouter = express.Router();

exercisesRouter.get(
  '/',
  passport.authenticate('auth', { session: false }),
  exercisesController.getExercises
);
exercisesRouter.post(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  exercisesController.createExercise
);
