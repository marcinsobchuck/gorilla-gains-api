import { Request } from 'express';
import { Types } from 'mongoose';

import { ActivityTypes } from '../../enum/activityTypes.enum';
import { CreateUserDto, EditUserDto } from '../../models/types/user.types';

export type CreateUserRequest = Request<object, any, CreateUserDto>;

export type EditUserInfoRequest = Request<object, any, EditUserDto>;

interface ActivitiesPerUserIdParams {
  userId: Types.ObjectId;
}

export type ActivitiesPerUserIdRequest = Request<ActivitiesPerUserIdParams, any, any, any>;

interface GetUserActivitiesQuery {
  type: ActivityTypes;
}

export type GetUserActivitiesRequest = Request<object, any, any, GetUserActivitiesQuery>;
