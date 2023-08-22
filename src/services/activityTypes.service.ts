import { ActivityTypes } from '../enum/activityTypes.enum';
import { Category } from '../enum/categories.enum';
import { ActivityType } from '../models/activityType';

export class ActivityTypesService {
  async getAll() {
    return ActivityType.find();
  }

  async createActivityType(type: ActivityTypes, category: Category) {
    let activityType = await ActivityType.findOne({
      type
    });
    if (activityType) {
      throw new Error('Activity already exists');
    }

    activityType = new ActivityType({
      type,
      category
    });

    await activityType.save();

    return activityType;
  }
}
