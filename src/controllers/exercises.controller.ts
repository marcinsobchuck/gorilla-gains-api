import { Response } from 'express';

import { CreateExerciseRequest, GetExercisesRequest } from './types/exercises.types';
import { validateExercise } from '../models/exercise';
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
}
