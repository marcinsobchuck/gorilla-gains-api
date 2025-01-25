import { Request } from 'express';
import { Types } from 'mongoose';

import { ExerciseDto } from '../../models/types/exercise.types';

export interface GetExercisesQueryOptions {
  activityType?: Types.ObjectId | Types.ObjectId[];
  filterText?: string;
  offset?: number;
  limit?: number;
}

export type GetExercisesRequest = Request<object, any, any, GetExercisesQueryOptions>;

export type CreateExerciseRequest = Request<object, any, ExerciseDto>;

export type ToggleFavouriteExerciseRequest = Request<{ exerciseId: Types.ObjectId }, any, any>;
