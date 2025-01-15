import { Request } from 'express';
import { Types } from 'mongoose';

import { ExerciseDto } from '../../models/types/exercise.types';

export interface GetExercisesQueryOptions {
  activityType?: Types.ObjectId | Types.ObjectId[];
  filterText?: string;
}

export type GetExercisesRequest = Request<object, any, any, GetExercisesQueryOptions>;

export type CreateExerciseRequest = Request<object, any, ExerciseDto>;
