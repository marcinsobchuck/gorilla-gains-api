import { endOfDay, startOfDay } from 'date-fns';
import { ObjectId } from 'mongodb';
import { FilterQuery, Types } from 'mongoose';

import { GetUserActivitiesQueryOptions } from '../controllers/types/activity.types';
import { Activity } from '../models/activity';
import { ActivityDto, ActivitySchema, PopulatedActivity } from '../models/types/activity.types';
import { User } from '../models/user';

export class ActivityService {
  async createActivity(activityDto: ActivityDto, user: Express.User) {
    const isNewActivityInThePast = startOfDay(new Date(activityDto.date)) <= startOfDay(new Date());
    const newActivity = { ...activityDto, isDone: isNewActivityInThePast };
    const activity = new Activity(newActivity);

    const populatedActivity = await activity.populate([
      { path: 'type' },
      { path: 'exercises.exercise' }
    ]);

    await populatedActivity.save();
    user.activities.push(populatedActivity._id);
    await user.save();
    return populatedActivity;
  }

  async getAllActivites() {
    const activities = await Activity.find().populate('type').populate('exercises.exercise');

    return activities;
  }

  async getUserActivities(user: Express.User, queryOptions: GetUserActivitiesQueryOptions) {
    const { type, limit, offset, startDate, endDate, pastOnly, isDone } = queryOptions;

    const parsedLimit = limit ? parseInt(limit) : Infinity;
    const parsedOffset = offset ? parseInt(offset) : 0;

    const filterQuery: FilterQuery<ActivitySchema> = {};

    if (pastOnly) {
      filterQuery.date = { $lte: new Date() };
      filterQuery.isDone = true;
    }

    if (startDate && endDate) {
      filterQuery.date = { $gte: startOfDay(startDate), $lte: endOfDay(endDate) };
    }

    if (type) {
      filterQuery.type = type;
    }

    if (isDone) {
      filterQuery.isDone = isDone;
    }

    const userActivities = (
      await user.populate<ActivitySchema>({
        path: 'activities',
        match: filterQuery,
        populate: [{ path: 'type' }, { path: 'exercises.exercise' }],
        options: {
          sort: {
            date: -1,
            createdAt: -1
          },
          skip: parsedOffset,
          limit: parsedLimit
        }
      })
    ).activities as unknown as PopulatedActivity[];

    const finalActivities = userActivities.map((activityDoc) => {
      const activity = activityDoc.toObject<PopulatedActivity>();

      const estimatedDuration = activity.exercises
        .map((exercise) =>
          exercise.sets.reduce(
            (acc, currSet) =>
              acc +
              (currSet.break || 0) +
              (currSet.duration?.seconds || 0) +
              (currSet.duration?.minutes || 0) * 60 +
              (currSet.duration?.hours || 0) * 60 * 60,
            0
          )
        )
        .reduce((a, b) => a + b, 0);

      return {
        ...activity,
        estimatedDuration
      };
    });

    return finalActivities;
  }

  async getUserActivityPresets(user: Express.User) {
    const userActivityPresets = await user.populate<ActivitySchema>({
      path: 'presets'
    });

    return userActivityPresets.presets;
  }

  async addActivityPreset(user: Express.User, activityId: string) {
    const activity = await Activity.findById(activityId);

    if (!activity) {
      throw new Error('Activity not found');
    }

    const newActivityPresetId = new ObjectId(activityId);

    if (user.presets.includes(newActivityPresetId)) {
      throw new Error('Preset already exists');
    }

    const userActivityPresets = user.presets;

    userActivityPresets.push(newActivityPresetId);
    await user.save();
  }

  async removeActivityPreset(user: Express.User, presetId: string) {
    const userActivityPresets = user.presets;

    const removeIndex = userActivityPresets.findIndex(
      (presetObjId) => presetObjId.toString() === presetId
    );

    if (removeIndex === -1) {
      throw new Error('Preset not found');
    }

    userActivityPresets.splice(removeIndex, 1);
    await user.save();
  }

  async getActivitiesPerUserId(userId: Types.ObjectId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('There is no user with given id');
    }

    const userActivities = await user.populate('activities').then((user) => user?.activities);
    return userActivities;
  }

  async editActivityById(activityId: string, user: Express.User, activityDto: ActivityDto) {
    const activity = user.activities.find((item) => String(item) === activityId);

    if (!activity) {
      throw new Error('There is no activity with given id that is connected to current user');
    }

    const result = await Activity.findByIdAndUpdate(activityId, activityDto, { new: true })
      .populate('type')
      .populate('exercises.exercise');

    return result;
  }

  async deleteActivity(activityId: string, user: Express.User) {
    const activityIndex = user.activities.findIndex((item) => String(item) === activityId);

    if (activityIndex === -1) {
      throw new Error('There is no activity with given id that is connected to current user');
    }

    const userActivities = user.activities;
    userActivities.splice(activityIndex, 1);
    user.save();
    return await Activity.findByIdAndDelete(activityId).populate('type');
  }
}
