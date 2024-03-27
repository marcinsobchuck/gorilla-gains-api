import { InferSchemaType, Types } from 'mongoose';

import { ActivityTypeSchema } from './activityType.types';
import { ExerciseSchema } from './exercise.types';
import { activitySchema } from '../activity';

interface Set {
  reps: number;
  load: number;
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
}

export interface PopulatedActivity {
  _id: string;
  title: string;
  type: ActivityTypeSchema;
  date: Date;
  exercises: {
    exercise: ExerciseSchema;
    sets: Set[];
    withBreaks: boolean;
  };
  notes?: string;
}
