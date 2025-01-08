import { Document, InferSchemaType, Types } from 'mongoose';

import { ActivityTypeSchema } from './activityType.types';
import { ExerciseSchema } from './exercise.types';
import { activitySchema } from '../activity';

interface Set {
  reps?: number;
  load?: number;
  duration?: Duration;
  distance?: number;
  break?: number;
  repeatCount?: number;
}

interface Exercise {
  exercise: Types.ObjectId;
  sets: Set[];
  withBreaks: boolean;
}

interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export type ActivitySchema = InferSchemaType<typeof activitySchema>;

export interface ActivityDto {
  title: string;
  type: Types.ObjectId;
  exercises: Exercise[];
  date: Date;
  notes?: string;
  warmup: boolean;
  repeatExercisesCount?: number;
  exertionRating: number;
  isPreset: boolean;
  isDone: boolean;
}

export interface PopulatedActivity extends Document {
  _id: string;
  title: string;
  type: ActivityTypeSchema;
  date: Date;
  exercises: {
    exercise: ExerciseSchema;
    sets: Set[];
    withBreaks: boolean;
  }[];
  repeatExercisesCount?: number;
  warmup: boolean;
  notes?: string;
  exertionRating: number;
  isPreset: boolean;
  isDone: boolean;
}
