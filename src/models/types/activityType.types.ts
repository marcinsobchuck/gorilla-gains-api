import { ActivityTypes } from '../../enum/activityTypes.enum';
import { Category } from '../../enum/categories.enum';

export interface ActivityTypeSchema {
  type: ActivityTypes;
  category: Category;
}
