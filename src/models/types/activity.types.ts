import { Types } from 'mongoose';

interface Set {
  reps: number;
  load: number;
}

interface Exercise {
  exercise: Types.ObjectId;
  sets: Set[];
}

export interface ActivitySchema {
  type: Types.ObjectId;
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
