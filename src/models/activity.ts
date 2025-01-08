import Joi from 'joi';
import mongoose, { Types } from 'mongoose';

import { ActivityDto, ActivitySchema } from './types/activity.types';
import { ActivityTypes } from '../enum/activityTypes.enum';
import { ActivityTypesService } from '../services/activityTypes.service';
import { ExercisesService } from '../services/exercises.service';

const activityTypesService = new ActivityTypesService();
const exercisesService = new ExercisesService();

const validateSetKeys = (setKeys: string[], keys: string[], activityType: string) => {
  const commonKeys = ['break', 'repeatCount'];

  const allowedKeys = [...commonKeys, ...keys];

  const invalidKeys = setKeys.filter((key) => !allowedKeys.includes(key));

  if (invalidKeys.length > 0) {
    throw new Error(
      `Invalid fields for ${activityType} exercise: ${invalidKeys.join(
        ', '
      )}. These are allowed fields: ${keys.join(', ')}`
    );
  }
};

export const activitySchema = new mongoose.Schema(
  {
    title: String,
    type: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ActivityType'
    },
    date: Date,
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise'
        },
        sets: [
          {
            reps: Number,
            load: Number,
            duration: {
              hours: Number,
              minutes: Number,
              seconds: Number
            },
            distance: Number,
            break: Number,
            repeatCount: Number,
            _id: false
          }
        ],
        withBreaks: Boolean,
        _id: false
      }
    ],
    notes: String,
    warmup: Boolean,
    repeatExercisesCount: Number,
    exertionRating: Number,
    isPreset: Boolean,
    isDone: Boolean
  },
  {
    timestamps: true
  }
);

export const Activity = mongoose.model<ActivitySchema>('Activity', activitySchema);

const durationSchema = Joi.object({
  hours: Joi.number(),
  minutes: Joi.number(),
  seconds: Joi.number()
}).custom((value) => {
  if (!value.hours && !value.minutes && !value.seconds) {
    throw new Error('At least one duration field is required');
  }
});

const checkValidExercise = async (data: string, activityType: Types.ObjectId) => {
  const res = await exercisesService.getExercisesPerActivityType(activityType);
  const exercisesIds = res.map((item) => String(item._id));
  const isMatch = exercisesIds.includes(data);

  if (!isMatch) {
    throw new Error(`There is no exercise for this activity type with the given id ${data}`);
  }
};

const checkValidActivityType = async (data: string) => {
  const res = await activityTypesService.getAll();
  const activityTypes = res.map((activityType) => activityType.id);
  const isMatch = activityTypes.includes(data);

  if (!isMatch) {
    throw new Error('Wrong activity type');
  }
};

const commonSetSchema = Joi.object({
  break: Joi.number().allow(null),
  repeatCount: Joi.number()
});

const strengthStaticSet = commonSetSchema.keys({
  duration: durationSchema.required(),
  load: Joi.number()
});

const strengthNonStaticSet = commonSetSchema.keys({
  reps: Joi.number().required(),
  load: Joi.number()
});

const enduranceSet = commonSetSchema.keys({
  distance: Joi.number(),
  duration: durationSchema.required()
});

const flexibilitySet = commonSetSchema.keys({
  duration: durationSchema.required()
});

const setSchema = Joi.alternatives().try(
  strengthStaticSet,
  strengthNonStaticSet,
  enduranceSet,
  flexibilitySet
);

export const validateActivity = async (activityDto: ActivityDto) => {
  const activityType = await activityTypesService.getActivityType(activityDto.type);

  const exerciseSchema = Joi.object({
    exercise: Joi.string()
      .external((data) => checkValidExercise(data, activityDto.type))
      .required(),
    sets: Joi.array()
      .items(setSchema)
      .external(async () => {
        for (const exercise of activityDto.exercises) {
          const exerciseId = exercise.exercise;
          const isExerciseStatic = await exercisesService.getIsExerciseStatic(exerciseId);

          for (const set of exercise.sets) {
            const setKeys = Object.keys(set);
            if (activityType === ActivityTypes.STRENGTH) {
              if (isExerciseStatic) {
                validateSetKeys(setKeys, ['duration', 'load'], activityType);
              } else {
                validateSetKeys(setKeys, ['reps', 'load'], activityType);
              }
            } else if (activityType === ActivityTypes.ENDURANCE) {
              validateSetKeys(setKeys, ['distance', 'duration'], activityType);
            } else if (activityType === ActivityTypes.FLEXIBILITY) {
              validateSetKeys(setKeys, ['duration'], activityType);
            } else if (activityType === ActivityTypes.BALANCE) {
              validateSetKeys(setKeys, ['duration'], activityType);
            }
          }
        }
      }),
    withBreaks: Joi.boolean()
  });

  const activitySchema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().external(checkValidActivityType).required(),
    date: Joi.date().required(),
    exercises: Joi.array().items(exerciseSchema),
    notes: Joi.string().allow(''),
    warmup: Joi.boolean(),
    repeatExercisesCount: Joi.number(),
    exertionRating: Joi.number(),
    isPreset: Joi.boolean(),
    isDone: Joi.boolean()
  });

  return activitySchema.validateAsync(activityDto);
};
