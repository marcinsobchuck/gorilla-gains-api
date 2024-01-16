import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityTypeDto, ActivityTypeSchema } from './types/activityType.types';
import { Category } from '../enum/categories.enum';

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(Category)
  }
});

export const ActivityType = mongoose.model<ActivityTypeSchema>('ActivityType', activityTypeSchema);

export const validateActivityType = (activityTypeDto: ActivityTypeDto) => {
  const schema = Joi.object({
    type: Joi.string().required(),
    category: Joi.string()
      .valid(...Object.values(Category))
      .required()
  });

  return schema.validate(activityTypeDto);
};
