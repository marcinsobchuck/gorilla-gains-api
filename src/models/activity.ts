import Joi from 'joi';
import mongoose, { Types } from 'mongoose';

import { ActivityDto, ActivitySchema } from './types/activity.types';
import { Category } from '../enum/categories.enum';
import { ActivityTypesService } from '../services/activityTypes.service';
import { ExercisesService } from '../services/exercises.service';

const activityTypesService = new ActivityTypesService();
const exercisesService = new ExercisesService();

export const activitySchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ActivityType'
  },
  date: Date,
  duration: {
    hours: Number,
    minutes: Number,
    seconds: Number
  },
  distance: Number,
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
          break: Number,
          duration: {
            hours: Number,
            minutes: Number,
            seconds: Number
          },
          distance: Number,
          _id: false
        }
      ],
      withBreaks: Boolean,
      _id: false
    }
  ],
  notes: String,
  warmup: Boolean,
  repeatExercisesCount: Number
});

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
  break: Joi.number().allow(null)
});

const strengthStaticSet = commonSetSchema.keys({
  duration: durationSchema.required(),
  load: Joi.number().required()
});

const strengthNonStaticSet = commonSetSchema.keys({
  reps: Joi.number().required(),
  load: Joi.number().required()
});

const enduranceSet = commonSetSchema.keys({
  distance: Joi.number().required(),
  duration: durationSchema.required()
});

export const validateActivity = async (activityDto: ActivityDto) => {
  const category = await activityTypesService.getCategoryForActivityType(activityDto.type);
  const setSchema = Joi.alternatives().try(strengthStaticSet, strengthNonStaticSet, enduranceSet);
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
            const commonKeys = ['break'];
            if (category === Category.STRENGTH) {
              if (isExerciseStatic) {
                const keys = ['duration', 'load'];
                const allowedKeys = [...commonKeys, ...keys];

                const invalidKeys = setKeys.filter((key) => !allowedKeys.includes(key));

                if (invalidKeys.length > 0) {
                  throw new Error(
                    `Invalid fields for static exercise: ${invalidKeys.join(
                      ', '
                    )}. These are allowed fields: ${keys.join(', ')}`
                  );
                }
              } else {
                const keys = ['reps', 'load'];
                const allowedKeys = [...commonKeys, ...keys];
                const invalidKeys = setKeys.filter((key) => !allowedKeys.includes(key));

                if (invalidKeys.length > 0) {
                  throw new Error(
                    `Invalid fields for non-static exercise: ${invalidKeys.join(
                      ', '
                    )}. These are allowed fields: ${keys.join(', ')}`
                  );
                }
              }
            } else if (category === Category.ENDURANCE) {
              const keys = ['distance', 'duration'];
              const allowedKeys = [...commonKeys, ...keys];
              const invalidKeys = setKeys.filter((key) => !allowedKeys.includes(key));

              if (invalidKeys.length > 0) {
                throw new Error(
                  `Invalid fields for endurance exercise: ${invalidKeys.join(
                    ', '
                  )}. These are allowed fields: ${keys.join(', ')}`
                );
              }
            }
          }
        }
      }),
    withBreaks: Joi.boolean()
  });

  const activitySchema = Joi.object({
    type: Joi.string().external(checkValidActivityType).required(),
    date: Joi.date().required(),
    exercises: Joi.array().items(exerciseSchema),
    distance: category === Category.OTHER ? Joi.number().required() : Joi.forbidden(),
    duration: category === Category.OTHER ? durationSchema.required() : Joi.forbidden(),
    notes: Joi.string().allow(''),
    warmup: Joi.boolean(),
    repeatExercisesCount: Joi.number()
  });

  return activitySchema.validateAsync(activityDto);
};
