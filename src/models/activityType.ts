import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityTypeSchema } from './types/activityType.types';
import { ActivityTypes } from '../enum/activityTypes.enum';
import { Category } from '../enum/categories.enum';

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(ActivityTypes)
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(Category)
  }
});

export const ActivityType = mongoose.model<ActivityTypeSchema>('ActivityType', activityTypeSchema);

export const validateActivityType = (activityType: ActivityTypeSchema) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(ActivityTypes))
      .required(),
    category: Joi.string()
      .valid(...Object.values(Category))
      .required()
  });

  return schema.validate(activityType);
};
