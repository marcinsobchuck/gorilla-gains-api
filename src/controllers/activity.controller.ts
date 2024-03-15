import { Request, Response } from 'express';

import {
  ActivitiesPerUserIdRequest,
  CreateActivityRequest,
  DeleteByActivityIdRequest,
  EditByActivityIdRequest,
  GetUserActivitiesRequest
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

  async getUserActivities(req: GetUserActivitiesRequest, res: Response) {
    if (req.user) {
      const { type } = req.query;
      const userActivities = await activityService.getUserActivities(req.user, type);
      res.send(userActivities);
    }
  }

  async getActivitiesPerUserId(req: ActivitiesPerUserIdRequest, res: Response) {
    try {
      const userActivities = await activityService.getActivitiesPerUserId(req.params.userId);
      res.send(userActivities);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
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
