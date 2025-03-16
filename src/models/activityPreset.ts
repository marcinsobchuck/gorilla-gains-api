import mongoose from 'mongoose';

import { activitySchema } from './activity';

export const activityPresetSchema = activitySchema.omit(['date']);

export const ActivityPreset = mongoose.model('ActivityPreset', activityPresetSchema);
