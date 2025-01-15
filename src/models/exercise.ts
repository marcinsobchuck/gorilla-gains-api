import Joi from 'joi';
import mongoose from 'mongoose';

import { ExerciseDto } from './types/exercise.types';

export const exerciseSchema = new mongoose.Schema({
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  isStatic: {
    type: Boolean
  },
  additionalInfo: {
    type: String
  },
  musclesHit: {
    primary: [String],
    secondary: [String]
  },
  description: {
    type: String
  },
  videoURL: {
    type: String
  }
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);

export const validateExercise = (exerciseDto: ExerciseDto) => {
  const schema = Joi.object({
    activityTypeId: Joi.string().required(),
    name: Joi.string().min(3).max(255).required(),
    isStatic: Joi.boolean(),
    additionalInfo: Joi.string(),
    musclesHit: Joi.object({
      primary: Joi.array().items(Joi.string()),
      secondary: Joi.array().items(Joi.string())
    }),
    description: Joi.string(),
    videoURL: Joi.string().uri()
  });

  return schema.validate(exerciseDto);
};
