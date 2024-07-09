import {
  differenceInDays,
  differenceInWeeks,
  eachMonthOfInterval,
  format,
  startOfMonth,
  subYears
} from 'date-fns';

import { ActivityTypesService } from './activityTypes.service';
import { GetActivitiesSummaryQueryOptions } from '../controllers/types/activitiesSummary.types';
import { ActivitySchema, PopulatedActivity } from '../models/types/activity.types';
interface Totals {
  weightLifted: number;
  reps: number;
  distance: number;
}

const activityTypesService = new ActivityTypesService();

export class ActivitiesSummaryService {
  async getActivitiesSummary(user: Express.User, queryOptions: GetActivitiesSummaryQueryOptions) {
    const userActivities = (
      await user.populate<ActivitySchema>({
        path: 'activities',
        populate: [{ path: 'type' }, { path: 'exercises.exercise' }],
        options: {
          sort: {
            date: -1
          }
        }
      })
    ).activities as unknown as PopulatedActivity[];

    const activitiesCount = userActivities.length;
    const daysSinceLastActivity = differenceInDays(new Date(), userActivities[0].date);

    const weeksBetweenTwoDates = differenceInWeeks(
      new Date(),
      userActivities[userActivities.length - 1].date
    );
    const averageActivitiesPerWeek = activitiesCount / weeksBetweenTwoDates;

    const allExercises = userActivities.flatMap((activity) =>
      activity.exercises.map((exercise) => exercise.exercise.name)
    );

    const getMostCommonExercise = (exercises: string[]) => {
      let maxCount = 0;
      let mostCommonExercise;

      exercises.forEach((outerExercise) => {
        let count = 0;
        exercises.forEach((innerExercise) => {
          if (outerExercise === innerExercise) {
            count++;
          }
        });

        if (count > maxCount) {
          maxCount = count;
          mostCommonExercise = outerExercise;
        }
      });

      return {
        maxCount,
        mostCommonExercise
      };
    };

    const getActivityTypeDistribution = async () => {
      const activityTypes = await activityTypesService.getAll();

      const activityTypeCounts: { [key: string]: number } = {};

      activityTypes.forEach((activityType) => {
        activityTypeCounts[activityType.type] = 0;
      });

      userActivities.forEach((activity) => {
        if (activity.type.type in activityTypeCounts) {
          activityTypeCounts[activity.type.type]++;
        } else {
          activityTypeCounts[activity.type.type] = 1;
        }
      });

      return Object.keys(activityTypeCounts).map((type) => ({
        name: type,
        value: activityTypeCounts[type]
      }));
    };
    const activityTypeDistribution = await getActivityTypeDistribution();
    const mostCommonExercise = getMostCommonExercise(allExercises);

    const totals = userActivities.reduce<Totals>(
      (activityAcc, activity) => {
        const activityTotals = activity.exercises.reduce<Totals>(
          (exerciseAcc, exercise) => {
            const exerciseTotals = exercise.sets.reduce<Totals>(
              (setAcc, currSet) => {
                return {
                  weightLifted: setAcc.weightLifted + (currSet.load || 0) * (currSet.reps || 1),
                  reps: setAcc.reps + (currSet.reps || 0),
                  distance: setAcc.distance + (currSet.distance || 0)
                };
              },
              { weightLifted: 0, reps: 0, distance: 0 }
            );

            return {
              weightLifted: exerciseAcc.weightLifted + exerciseTotals.weightLifted,
              reps: exerciseAcc.reps + exerciseTotals.reps,
              distance: exerciseAcc.distance + exerciseTotals.distance
            };
          },
          { weightLifted: 0, reps: 0, distance: 0 }
        );

        return {
          weightLifted:
            (activityAcc.weightLifted + activityTotals.weightLifted) *
            (activity.repeatExercisesCount || 1),
          reps: activityAcc.reps + activityTotals.reps * (activity.repeatExercisesCount || 1),
          distance:
            activityAcc.distance + activityTotals.distance * (activity.repeatExercisesCount || 1)
        };
      },
      { weightLifted: 0, reps: 0, distance: 0 }
    );

    const now = new Date();
    const yearAgo = startOfMonth(subYears(new Date(), 1));

    const activitiesFromLast12Months = userActivities.filter(
      (activity) => activity.date <= now && activity.date >= yearAgo
    );
    const last12Months = eachMonthOfInterval({
      start: yearAgo,
      end: now
    }).map((month) => format(month, 'MMM-yyyy'));

    const activitiesInYear = last12Months.map((month) => {
      const formatDateToMonth = (date: Date) => format(new Date(date), 'MMM-yyyy');
      let count = 0;

      activitiesFromLast12Months.forEach((activity) => {
        if (formatDateToMonth(activity.date) === month) {
          count++;
        }
      });

      const [monthName] = month.split('-');

      return { name: monthName, value: count };
    });

    return {
      totals,
      activitiesCount,
      daysSinceLastActivity,
      averageActivitiesPerWeek,
      mostCommonExercise,
      activitiesInYear,
      activityTypeDistribution
    };
  }
}
