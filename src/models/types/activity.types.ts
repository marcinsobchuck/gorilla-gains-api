import { Types } from 'mongoose';

import { ActivityTypes } from '../../enum/activityTypes.enum';

interface Set {
  reps: number;
  load: number;
}

interface Exercise {
  exercise: Types.ObjectId;
  sets: Set[];
}

export interface ActivitySchema {
  type: ActivityTypes;
  exercises: Exercise[];
  date: Date;
  duration: number;
}

export interface ActivityDto {
  type: Types.ObjectId;
  exercises: Exercise[];
  date: Date;
  duration: number;
}
