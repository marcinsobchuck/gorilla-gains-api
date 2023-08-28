import { Request } from 'express';
import { Types } from 'mongoose';

import { UserDto } from '../../models/types/user.types';

export type CreateUserRequest = Request<object, any, UserDto>;

interface ActivitiesPerUserIdParams {
  userId: Types.ObjectId;
}

export type ActivitiesPerUserIdRequest = Request<ActivitiesPerUserIdParams, any, any, any>;
