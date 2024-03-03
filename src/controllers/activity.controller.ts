import { Request, Response } from 'express';

import {
  CreateActivityRequest,
  DeleteByActivityIdRequest,
  EditByActivityIdRequest
} from './types/activity.types';
import { validateActivity } from '../models/activity';
import { ActivityService } from '../services/activity.service';

const activityService = new ActivityService();

export class ActivityController {
  async createActivity(req: CreateActivityRequest, res: Response) {
    try {
      const { error } = await validateActivity(req.body);

      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      const user = req.user;
      if (user) {
        const activity = await activityService.createActivity(req.body, user);
        res.send(activity);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }

  async getAllActivities(req: Request, res: Response) {
    const activities = await activityService.getAllActivites();
    res.send(activities);
  }

  async editActivityById(req: EditByActivityIdRequest, res: Response) {
    if (req.user) {
      try {
        const activity = await activityService.editActivityById(
          req.params.activityId,
          req.user,
          req.body
        );
        res.send(activity);
      } catch (err: any) {
        res.status(400).send(err.message);
      }
    }
  }

  async deleteActivity(req: DeleteByActivityIdRequest, res: Response) {
    if (req.user) {
      try {
        const activity = await activityService.deleteActivity(req.params.activityId, req.user);
        res.send(activity);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    }
  }
}
