import Joi from 'joi';
import mongoose from 'mongoose';

import { ExerciseDto, ExerciseSchema } from './types/exercise.types';

const exerciseSchema = new mongoose.Schema({
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  }
});

export const Exercise = mongoose.model<ExerciseSchema>('Exercise', exerciseSchema);

export const validateExercise = (exerciseDto: ExerciseDto) => {
  const schema = Joi.object({
    activityTypeId: Joi.string().required(),
    name: Joi.string().min(3).max(255).required()
  });

  return schema.validate(exerciseDto);
};
