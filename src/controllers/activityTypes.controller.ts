import { Response } from 'express';

import { CreateActivityTypeRequest, GetActivityTypesRequest } from './types/activityTypes.types';
import { validateActivityType } from '../models/activityType';
import { ActivityTypesService } from '../services/activityTypes.service';

const activityTypesService = new ActivityTypesService();

export class ActivityTypesController {
  async getAllActivityTypes(req: GetActivityTypesRequest, res: Response) {
    try {
      const activityTypes = await activityTypesService.getAll(req.query.filterText);
      res.send(activityTypes);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }

  async createActivityType(req: CreateActivityTypeRequest, res: Response) {
    const { error } = validateActivityType(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const activityType = await activityTypesService.createActivityType(req.body);

      res.send(activityType);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
}
