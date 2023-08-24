import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityDto, ActivitySchema } from './types/activity.types';

export const activitySchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  date: Date,
  duration: Number,
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      },
      sets: [
        {
          reps: Number,
          load: Number
        }
      ]
    }
  ]
});

export const Activity = mongoose.model<ActivitySchema>('Activity', activitySchema);

export const validateActivity = (activityDto: ActivityDto) => {
  const setSchema = Joi.object({
    reps: Joi.number().required(),
    load: Joi.number().required()
  });

  const exerciseSchema = Joi.object({
    exercise: Joi.string().required(),
    sets: Joi.array().items(setSchema)
  });

  const activitySchema = Joi.object({
    type: Joi.string().required(),
    date: Joi.date().required(),
    duration: Joi.number().required(),
    exercises: Joi.array().items(exerciseSchema).required()
  });

  return activitySchema.validate(activityDto);
};
