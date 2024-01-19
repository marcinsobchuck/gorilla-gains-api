import Joi from 'joi';
import mongoose from 'mongoose';

import { ActivityDto, ActivitySchema } from './types/activity.types';
import { ActivityTypes } from '../enum/activityTypes.enum';

const strengthActivityTypes = [ActivityTypes.CALISTHENICS, ActivityTypes.WEIGHT_LIFTING];
const enduranceActivityTypes = [
  ActivityTypes.SWIMMING,
  ActivityTypes.RIDING_A_BIKE_INTERVALS,
  ActivityTypes.RUNNING_INTERVALS
];
const otherActivityTypes = [
  ActivityTypes.WALKING,
  ActivityTypes.RUNNING,
  ActivityTypes.RIDING_A_BIKE
];

const generateSetValidationSchema = (activityType: ActivityTypes) => {
  const commonSetSchema = Joi.object().keys({
    break: Joi.number()
  });

  let typeSpecificSetSchema;

  if (strengthActivityTypes.includes(activityType)) {
    typeSpecificSetSchema = commonSetSchema.keys({
      reps: Joi.number().required(),
      load: Joi.number().required(),
      break: Joi.number()
    });
  }
  if (enduranceActivityTypes.includes(activityType)) {
    typeSpecificSetSchema = commonSetSchema.keys({
      distance: Joi.number().required(),
      duration: Joi.number().required(),
      break: Joi.number()
    });
  }

  if (otherActivityTypes.includes(activityType)) {
    typeSpecificSetSchema = Joi.object({});
  }
  return typeSpecificSetSchema;
};

export const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(ActivityTypes)
  },
  date: Date,
  duration: Number,
  distance: Number,
  exercises: [
    {
      exercise: String,
      sets: [
        {
          reps: Number,
          load: Number,
          break: Number,
          duration: Number,
          distance: Number,

          _id: false
        }
      ],
      _id: false
    }
  ]
});

export const Activity = mongoose.model<ActivitySchema>('Activity', activitySchema);

export const validateActivity = (activityDto: ActivityDto) => {
  const exerciseSchema = Joi.object({
    exercise: Joi.string().required(),
    sets: Joi.array().items(generateSetValidationSchema(activityDto.type) || Joi.object({}))
  });

  const activitySchema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(ActivityTypes))
      .required(),
    date: Joi.date().required(),
    exercises: Joi.array().items(exerciseSchema).required(),
    ...(otherActivityTypes.includes(activityDto.type) && {
      distance: Joi.number().required(),
      duration: Joi.number().required()
    })
  });

  return activitySchema.validate(activityDto);
};
