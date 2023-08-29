import { Activity } from '../models/activity';
import { ActivityDto } from '../models/types/activity.types';

export class ActivityService {
  async createActivity(activityDto: ActivityDto, user: Express.User) {
    const activity = new Activity(activityDto);
    await activity.save();
    user.activities.push(activity._id);
    await user.save();
    return activity;
  }

  async getAllActivites() {
    const activities = await Activity.find();

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
}
