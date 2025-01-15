import { InferSchemaType } from 'mongoose';

import { exerciseSchema } from '../exercise';

export type ExerciseSchema = InferSchemaType<typeof exerciseSchema>;

export interface ExerciseDto {
  activityTypeId: string;
  name: string;
  additionalInfo?: string;
  isStatic?: boolean;
  musclesHit?: {
    primary: string[];
    secondary: string[];
  };
  description?: string;
  videoURL?: string;
}
