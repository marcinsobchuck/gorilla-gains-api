import { Types } from 'mongoose';

import { Exercise } from '../models/exercise';
import { ExerciseDto } from '../models/types/exercise.types';

export class ExercisesService {
  async getExercisesPerActivityType(activityTypeId: Types.ObjectId) {
    return await Exercise.find({ activityType: activityTypeId }).populate('activityType');
  }

  async createExercise(exerciseDto: ExerciseDto) {
    const { name, activityTypeId } = exerciseDto;

    let exercise = await Exercise.findOne({ name });
    if (exercise) {
      throw new Error('Exercise already exists');
    }

    exercise = new Exercise({
      activityType: activityTypeId,
      name
    });

    await exercise.save();

    return exercise;
  }
}
