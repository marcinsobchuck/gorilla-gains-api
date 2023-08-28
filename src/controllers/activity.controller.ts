import { Request, Response } from 'express';

import { CreateActivityRequest } from './types/activity.types';
import { validateActivity } from '../models/activity';
import { ActivityService } from '../services/activity.service';

const activityService = new ActivityService();

export class ActivityController {
  async createActivity(req: CreateActivityRequest, res: Response) {
    const { error } = validateActivity(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
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
}
