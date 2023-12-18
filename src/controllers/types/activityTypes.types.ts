import { Request } from 'express';

import { ActivityTypeDto } from '../../models/types/activityType.types';

export type CreateActivityTypeRequest = Request<object, any, ActivityTypeDto>;

interface GetActivityTypesQuery {
  filterText: string;
}

export type GetActivityTypesRequest = Request<object, any, any, GetActivityTypesQuery>;
