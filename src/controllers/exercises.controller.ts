import { Response } from 'express';

import { CreateExerciseRequest, ExercisesPerActivityTypeRequest } from './types/exercises.types';
import { validateExercise } from '../models/exercise';
import { ExercisesService } from '../services/exercises.service';

const exercisesService = new ExercisesService();

export class ExercisesController {
  async getExercisesPerActivityType(req: ExercisesPerActivityTypeRequest, res: Response) {
    const exercises = await exercisesService.getExercisesPerActivityType(req.query.activityTypeId);
    res.send(exercises);
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
