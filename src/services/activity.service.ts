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
}
