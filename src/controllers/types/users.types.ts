import { Request } from 'express';
import { Types } from 'mongoose';

import { ActivityTypes } from '../../enum/activityTypes.enum';
import { EditUserDto } from '../../models/types/user.types';

export type EditUserInfoRequest = Request<object, any, EditUserDto>;

interface ActivitiesPerUserIdParams {
  userId: Types.ObjectId;
}

export type ActivitiesPerUserIdRequest = Request<ActivitiesPerUserIdParams>;

interface GetUserActivitiesQuery {
  type: ActivityTypes;
}

export type GetUserActivitiesRequest = Request<object, any, any, GetUserActivitiesQuery>;
