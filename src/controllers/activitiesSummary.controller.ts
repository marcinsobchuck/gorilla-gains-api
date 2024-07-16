import { Request, Response } from 'express';

import { ActivitiesSummaryService } from '../services/activitiesSummary.service';

const activitiesSummaryService = new ActivitiesSummaryService();

export class ActivitiesSummaryController {
  async getSummary(req: Request, res: Response) {
    try {
      if (req.user) {
        const activtiesSummary = await activitiesSummaryService.getActivitiesSummary(req.user);
        res.send(activtiesSummary);
      }
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}
