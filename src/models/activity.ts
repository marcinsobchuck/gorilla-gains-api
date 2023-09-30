import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityDto, ActivitySchema } from './types/activity.types';
import { ActivityTypes } from '../enum/activityTypes.enum';

export const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(ActivityTypes)
  },
  date: Date,
  duration: Number,
  exercises: [
    {
      exercise: String,
      sets: [
        {
          reps: Number,
          load: Number,
          _id: false
        }
      ],
      _id: false
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
    type: Joi.string()
      .valid(...Object.values(ActivityTypes))
      .required(),
    date: Joi.date().required(),
    duration: Joi.number().required(),
    exercises: Joi.array().items(exerciseSchema).required()
  });

  return activitySchema.validate(activityDto);
};
