import { InferSchemaType, Types } from 'mongoose';

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
  type: Types.ObjectId;
  exercises: Exercise[];
  date: Date;
  distance?: number;
  duration?: Duration;
  notes?: string;
  warmup: boolean;
  repeatExercisesCount?: number;
}
