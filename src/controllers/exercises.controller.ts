import { Request, Response } from 'express';

import {
  CreateExerciseRequest,
  GetExercisesRequest,
  ToggleFavouriteExerciseRequest
} from './types/exercises.types';
import { validateExercise, validateToggleExercise } from '../models/exercise';
import { ExercisesService } from '../services/exercises.service';

const exercisesService = new ExercisesService();

export class ExercisesController {
  async getExercises(req: GetExercisesRequest, res: Response) {
    try {
      const exercises = await exercisesService.getExercises(req.query);
      res.send(exercises);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }

  async createExercise(req: CreateExerciseRequest, res: Response) {
    const { error } = validateExercise(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const exercise = await exercisesService.createExercise(req.body);
      res.send(exercise);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
  async toggleFavouriteExercise(req: ToggleFavouriteExerciseRequest, res: Response) {
    if (req.user) {
      const { error } = validateToggleExercise(req.params.exerciseId);

      if (error) return res.status(400).send(error.details[0].message);

      try {
        const exercise = await exercisesService.toggleFavouriteExercise(
          req.params.exerciseId,
          req.user
        );
        res.send(exercise);
      } catch (err: any) {
        res.status(400).send(err.message);
      }
    }
  }
  async getFavouriteExercises(req: Request, res: Response) {
    if (req.user) {
      try {
        const exercises = await exercisesService.getFavouriteExercises(req.user);
        res.send(exercises);
      } catch (err: any) {
        res.status(400).send(err.message);
      }
    }
  }
}
