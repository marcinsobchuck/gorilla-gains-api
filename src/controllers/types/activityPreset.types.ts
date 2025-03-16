import { Request } from 'express';

import { ActivityDto } from '../../models/types/activity.types';

export type CreateActivityPresetRequest = Request<object, any, ActivityDto>;
export type DeleteActivityPresetRequest = Request<{ presetId: string }>;
