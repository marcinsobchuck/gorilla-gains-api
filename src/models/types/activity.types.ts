import { ActivityTypes } from '../../enum/activityTypes.enum';

interface Set {
  reps: number;
  load: number;
}

interface Exercise {
  exercise: string;
  sets: Set[];
}

export interface ActivitySchema {
  type: ActivityTypes;
  exercises: Exercise[];
  date: Date;
  duration: number;
}

export interface ActivityDto {
  type: ActivityTypes;
  exercises: Exercise[];
  date: Date;
  duration: number;
}
