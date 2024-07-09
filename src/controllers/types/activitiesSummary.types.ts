import { Request } from 'express';

export interface GetActivitiesSummaryQueryOptions {
  startDate?: string;
  endDate?: string;
}

export type GetActivitiesSummaryRequest = Request<
  object,
  any,
  any,
  GetActivitiesSummaryQueryOptions
>;
