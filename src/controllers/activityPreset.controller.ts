import { Request, Response } from 'express';

import {
  CreateActivityPresetRequest,
  DeleteActivityPresetRequest
} from './types/activityPreset.types';
import { ActivityPresetService } from '../services/activityPreset.service';

const activityPresetService = new ActivityPresetService();

export class ActivityPresetController {
  async getUserActivityPresets(req: Request, res: Response) {
    try {
      if (req.user) {
        const activityPresets = await activityPresetService.getUserActivityPresets(req.user);

        res.send(activityPresets);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
  async createActivityPreset(req: CreateActivityPresetRequest, res: Response) {
    try {
      if (req.user) {
        const activityPreset = await activityPresetService.createActivityPreset(req.user, req.body);

        res.send(activityPreset);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
  async deleteActivityPreset(req: DeleteActivityPresetRequest, res: Response) {
    try {
      if (req.user) {
        const activityPreset = await activityPresetService.deleteActivityPreset(
          req.params.presetId
        );

        res.send(activityPreset);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
}
