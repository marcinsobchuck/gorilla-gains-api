import { ActivityType } from '../models/activityType';
import { ActivityTypeDto } from '../models/types/activityType.types';

export class ActivityTypesService {
  async getAll() {
    return await ActivityType.find();
  }

  async createActivityType(activityTypeDto: ActivityTypeDto) {
    const { type } = activityTypeDto;

    let activityType = await ActivityType.findOne({
      type
    });
    if (activityType) {
      throw new Error('Activity already exists');
    }

    activityType = new ActivityType(activityTypeDto);

    await activityType.save();

    return activityType;
  }
}
