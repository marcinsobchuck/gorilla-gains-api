import { Request } from 'express';

import { ActivityDto } from '../../models/types/activity.types';

export type CreateActivityRequest = Request<object, any, ActivityDto>;

interface EditByActivityIdRequestParams {
  activityId: string;
}

export type EditByActivityIdRequest = Request<EditByActivityIdRequestParams, any, ActivityDto>;

interface DeleteByActivityIdParams {
  activityId: string;
}

export type DeleteByActivityIdRequest = Request<DeleteByActivityIdParams>;
