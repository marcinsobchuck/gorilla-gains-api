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
    ref: 'ActivityType'
  },
  date: Date,
  duration: Number,
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

const generateSetSchema = (category: Category) => {
  let setSchema;

  const commonSetSchema = Joi.object().keys({
    break: Joi.number()
  });

  if (category === Category.STRENGTH) {
    setSchema = commonSetSchema.keys({
      reps: Joi.number().required(),
      load: Joi.number().required()
    });
  } else if (category === Category.ENDURANCE) {
    setSchema = commonSetSchema.keys({
      distance: Joi.number().required(),
      duration: Joi.number().required()
    });
  } else {
    setSchema = Joi.object({});
  }

  return setSchema;
};

const checkValidExercise = async (data: string, activityType: Types.ObjectId) => {
  const res = await exercisesService.getExercisesPerActivityType(activityType);
  const exercisesIds = res.map((item) => String(item._id));
  const isMatch = exercisesIds.includes(data);

  if (!isMatch) {
    throw new Error(`There is no exercise with the id ${data}`);
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

export const validateActivity = async (activityDto: ActivityDto) => {
  const category = await activityTypesService.getCategoryForActivityType(activityDto.type);

  const setSchema = generateSetSchema(category);

  const exerciseSchema = Joi.object({
    exercise: Joi.string()
      .external((data) => checkValidExercise(data, activityDto.type))
      .required(),
    sets: Joi.array().items(setSchema)
  });

  const activitySchema = Joi.object({
    type: Joi.string().external(checkValidActivityType).required(),
    date: Joi.date().required(),
    exercises: Joi.array().items(exerciseSchema),
    distance: category === Category.OTHER ? Joi.number().required() : Joi.forbidden(),
    duration: category === Category.OTHER ? Joi.number().required() : Joi.forbidden()
  });

  return activitySchema.validateAsync(activityDto);
};
