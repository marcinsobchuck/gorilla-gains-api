export interface ExerciseSchema {
  activityType: string;
  name: string;
  isStatic: string;
}

export interface ExerciseDto {
  activityTypeId: string;
  name: string;
  additionalInfo?: string;
  isStatic?: boolean;
  musclesHit?: {
    primary: string[];
    secondary: string[];
  };
}
