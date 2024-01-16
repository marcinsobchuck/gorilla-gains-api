import { Category } from '../../enum/categories.enum';

export interface ActivityTypeSchema {
  type: string;
  category: Category;
}

export interface ActivityTypeDto {
  type: string;
  category: Category;
}
