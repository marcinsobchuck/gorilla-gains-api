import { Activity } from '../models/activity';
import { ActivityDto } from '../models/types/activity.types';

export class ActivityService {
  async createActivity(activityDto: ActivityDto, user: Express.User) {
    const activity = new Activity(activityDto);
    console.log(activity);

    await activity.save();
    user.activities.push(activity._id);
    await user.save();
    return activity;
  }

  async getAllActivites() {
    const activities = await Activity.find().populate('type').populate('exercises.exercise');

    return activities;
  }

  async editActivityById(activityId: string, user: Express.User, activityDto: ActivityDto) {
    const activity = user.activities.find((item) => String(item) === activityId);

    if (!activity) {
      throw new Error('There is no activity with given id that is connected to current user');
    }

    const result = await Activity.findByIdAndUpdate(activityId, activityDto, { new: true });

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
