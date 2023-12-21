import { Request } from 'express';
import { Types } from 'mongoose';

import { ExerciseDto } from '../../models/types/exercise.types';

interface ExercisesPerActivityTypeQuery {
  activityTypeId: Types.ObjectId;
  filterText: string;
}

export type ExercisesPerActivityTypeRequest = Request<
  object,
  any,
  any,
  ExercisesPerActivityTypeQuery
>;

export type CreateExerciseRequest = Request<object, any, ExerciseDto>;
