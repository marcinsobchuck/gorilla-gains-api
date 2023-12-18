import { FilterQuery } from 'mongoose';

import { ActivityType } from '../models/activityType';
import { ActivityTypeDto, ActivityTypeSchema } from '../models/types/activityType.types';

export class ActivityTypesService {
  async getAll(filterText: string) {
    let filters: FilterQuery<ActivityTypeSchema> = {};

    if (filterText) {
      console.log({ filterText });

      filters = {
        type: {
          $regex: filterText,
          $options: 'i'
        }
      };
    }
    return await ActivityType.find(filters);
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
