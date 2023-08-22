import { Request, Response } from 'express';

import { validateActivityType } from '../models/activityType';
import { ActivityTypesService } from '../services/activityTypes.service';

const activityTypesService = new ActivityTypesService();

export class ActivityTypesController {
  async getAllActivityTypes(req: Request, res: Response) {
    const activityTypes = await activityTypesService.getAll();
    res.send(activityTypes);
  }

  async createActivityType(req: Request, res: Response) {
    const { type, category } = req.body;
    const { error } = validateActivityType(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const activityType = await activityTypesService.createActivityType(type, category);

      res.send(activityType);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
}
