import { FilterQuery, Types } from 'mongoose';

import { ActivityType } from '../models/activityType';
import { Exercise } from '../models/exercise';
import { ExerciseDto, ExerciseSchema } from '../models/types/exercise.types';

export class ExercisesService {
  async getExercisesPerActivityType(activityTypeId: Types.ObjectId, filterText?: string) {
    const filters: FilterQuery<ExerciseSchema> = {
      activityType: activityTypeId
    };

    if (filterText) {
      filters.name = {
        $regex: filterText,
        $options: 'i'
      };
    }

    return await Exercise.find(filters).populate('activityType');
  }

  async createExercise(exerciseDto: ExerciseDto) {
    const {
      name,
      activityTypeId,
      isStatic,
      additionalInfo,
      musclesHit: { primary, secondary } = {}
    } = exerciseDto;

    const activityType = await ActivityType.findById(activityTypeId);

    if (!activityType) {
      throw new Error(`There is no activityType with an id of ${activityTypeId}`);
    }

    let exercise = await Exercise.findOne({ name });

    if (exercise) {
      throw new Error('Exercise already exists');
    }

    exercise = new Exercise({
      activityType: activityTypeId,
      name,
      additionalInfo,
      isStatic,
      musclesHit: {
        primary,
        secondary
      }
    });

    await exercise.save();

    return exercise;
  }

  async getIsExerciseStatic(exerciseId: Types.ObjectId) {
    const exercise = await Exercise.findById(exerciseId);
    const isExerciseStatic = exercise?.isStatic;
    return isExerciseStatic;
  }
}
