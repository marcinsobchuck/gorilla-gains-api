import { Request } from 'express';

import { ActivityDto } from '../../models/types/activity.types';

export type CreateActivityRequest = Request<object, any, ActivityDto>;
