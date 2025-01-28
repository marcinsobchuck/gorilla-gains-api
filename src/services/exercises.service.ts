import { FilterQuery, Types } from 'mongoose';

import { GetExercisesQueryOptions } from '../controllers/types/exercises.types';
import { ActivityType } from '../models/activityType';
import { Exercise } from '../models/exercise';
import { ExerciseDto, ExerciseSchema } from '../models/types/exercise.types';

export class ExercisesService {
  async getExercises(queryOptions: GetExercisesQueryOptions) {
    const { activityType, filterText, limit, offset } = queryOptions;
    const filters: FilterQuery<ExerciseSchema> = {};

    if (activityType) {
      filters.activityType = activityType;
    }

    if (filterText) {
      filters.name = {
        $regex: filterText,
        $options: 'i'
      };
    }

    const exercises = await Exercise.find(filters)
      .populate('activityType')
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({
        name: 1
      });

    return exercises;
  }

  async createExercise(exerciseDto: ExerciseDto) {
    const { activityTypeId, name } = exerciseDto;
    const activityType = await ActivityType.findById(activityTypeId);

    if (!activityType) {
      throw new Error(`There is no activityType with an id of ${activityTypeId}`);
    }

    let exercise = await Exercise.findOne({ name });

    if (exercise) {
      throw new Error('Exercise already exists');
    }

    exercise = new Exercise({ ...exerciseDto, activityType: activityTypeId });

    await exercise.save();

    return exercise;
  }

  async getIsExerciseStatic(exerciseId: Types.ObjectId) {
    const exercise = await Exercise.findById(exerciseId);
    const isExerciseStatic = exercise?.isStatic;
    return isExerciseStatic;
  }

  async toggleFavouriteExercise(exerciseId: Types.ObjectId, user: Express.User) {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new Error(`There is no exercise with an id of ${exerciseId}`);
    }

    const index = user.favouriteExercises.indexOf(exerciseId);

    if (index === -1) {
      user.favouriteExercises.push(exerciseId);
    } else {
      user.favouriteExercises.splice(index, 1);
    }

    await user.save();

    return exercise;
  }

  async getFavouriteExercises(user: Express.User) {
    const currentUser = await user.populate<ExerciseSchema>({
      path: 'favouriteExercises',
      populate: [{ path: 'activityType' }],
      options: { sort: { name: 1 } }
    });
    return currentUser.favouriteExercises;
  }
}
