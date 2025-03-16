import { ActivityPreset } from '../models/activityPreset';
import { ActivityDto } from '../models/types/activity.types';

export class ActivityPresetService {
  async getUserActivityPresets(user: Express.User) {
    const activityPresets = await ActivityPreset.find({ createdBy: user._id })
      .populate('type')
      .populate('exercises.exercise');

    return activityPresets;
  }

  async createActivityPreset(user: Express.User, activity: ActivityDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { date, makePresetFrom, ...activityPresetData } = activity;

    const activityPreset = new ActivityPreset({ ...activityPresetData, createdBy: user._id });

    await activityPreset.save();

    return activityPreset;
  }

  async deleteActivityPreset(presetId: string) {
    const presetActivity = await ActivityPreset.findByIdAndDelete(presetId);

    if (!presetActivity) {
      throw new Error('No preset found with the given id');
    }

    return presetActivity;
  }
}
