import { Response } from 'express';

import { GetActivitiesSummaryRequest } from './types/activitiesSummary.types';
import { ActivitiesSummaryService } from '../services/activitiesSummary.service';

const activitiesSummaryService = new ActivitiesSummaryService();

export class ActivitiesSummaryController {
  async getSummary(req: GetActivitiesSummaryRequest, res: Response) {
    try {
      if (req.user) {
        const activtiesSummary = await activitiesSummaryService.getActivitiesSummary(
          req.user,
          req.query
        );
        res.send(activtiesSummary);
      }
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}
