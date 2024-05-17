import { FilterQuery, Types } from 'mongoose';

import { GetUserActivitiesQueryOptions } from '../controllers/types/activity.types';
import { Activity } from '../models/activity';
import { ActivityDto, ActivitySchema, PopulatedActivity } from '../models/types/activity.types';
import { User } from '../models/user';

export class ActivityService {
  async createActivity(activityDto: ActivityDto, user: Express.User) {
    const activity = new Activity(activityDto);

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
    const { isPreset, type, limit, offset, startDate, endDate } = queryOptions;

    const parsedLimit = limit ? parseInt(limit) : 10;
    const parsedOffset = offset ? parseInt(offset) : 0;
    console.log(new Date('20/04/2024'));

    const dateFilter: FilterQuery<ActivitySchema> = {};

    if (startDate && endDate) {
      dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const userActivities = (
      await user.populate<ActivitySchema>({
        path: 'activities',
        match: { ...dateFilter, ...(isPreset ? { isPreset: true } : {}) },
        populate: [{ path: 'type' }, { path: 'exercises.exercise' }],
        options: {
          sort: {
            createdAt: -1
          }
        }
      })
    ).activities as unknown as PopulatedActivity[];

    if (type) {
      return userActivities.filter((activity) => String(activity.type._id) === type);
    }

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

    return finalActivities.slice(parsedOffset, parsedOffset + parsedLimit);
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
    return await Activity.findByIdAndDelete(activityId);
  }
}
