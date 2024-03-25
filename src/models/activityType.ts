import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityTypeDto, ActivityTypeSchema } from './types/activityType.types';

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  }
});

export const ActivityType = mongoose.model<ActivityTypeSchema>('ActivityType', activityTypeSchema);

export const validateActivityType = (activityTypeDto: ActivityTypeDto) => {
  const schema = Joi.object({
    type: Joi.string().required()
  });

  return schema.validate(activityTypeDto);
};
