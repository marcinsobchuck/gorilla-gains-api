import { Activity } from '../models/activity';
import { ActivityDto } from '../models/types/activity.types';

export class ActivityService {
  async createActivity(activityDto: ActivityDto, user: Express.User) {
    const activity = new Activity(activityDto);
    user.activities.push(activity);
    await user.save();
    return activity;
  }

  async getAllActivites() {
    const activities = await Activity.find()
      .populate('type')
      .populate('exercises.exercise', '-activityType')
      .select('-exercises.sets._id');
    return activities;
  }
}
