import { Request } from 'express';

import { ActivityTypeDto } from '../../models/types/activityType.types';

export type CreateActivityTypeRequest = Request<object, any, ActivityTypeDto>;
