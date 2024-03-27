import { Request } from 'express';
import { Types } from 'mongoose';

import { ActivityDto } from '../../models/types/activity.types';

interface ActivitiesPerUserIdParams {
  userId: Types.ObjectId;
}

export type ActivitiesPerUserIdRequest = Request<ActivitiesPerUserIdParams>;

interface GetUserActivitiesQuery {
  type: string;
}

export type GetUserActivitiesRequest = Request<object, any, any, GetUserActivitiesQuery>;

export type CreateActivityRequest = Request<object, any, ActivityDto>;

interface EditByActivityIdRequestParams {
  activityId: string;
}

export type EditByActivityIdRequest = Request<EditByActivityIdRequestParams, any, ActivityDto>;

interface DeleteByActivityIdParams {
  activityId: string;
}

export type DeleteByActivityIdRequest = Request<DeleteByActivityIdParams>;
