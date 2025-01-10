import {
  differenceInDays,
  differenceInWeeks,
  eachMonthOfInterval,
  format,
  startOfMonth,
  subYears
} from 'date-fns';

import { ActivityTypesService } from './activityTypes.service';
import { ActivitySchema, PopulatedActivity } from '../models/types/activity.types';
interface Totals {
  weightLifted: number;
  reps: number;
  distance: number;
}

const activityTypesService = new ActivityTypesService();

export class ActivitiesSummaryService {
  async getActivitiesSummary(user: Express.User) {
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

    const activityTypes = (await activityTypesService.getAll()).map(
      (activityType) => activityType.type
    );

    if (userActivities.length === 0) {
      return [];
    }

    const activitiesCount = userActivities.length;
    const lastActivity = userActivities.find((activity) => activity.date < new Date());
    const daysSinceLastActivity = lastActivity
      ? differenceInDays(new Date(), lastActivity?.date)
      : '-';

    const weeksBetweenTwoDates = differenceInWeeks(
      new Date(),
      userActivities[userActivities.length - 1].date
    );

    const averageActivitiesPerWeek = weeksBetweenTwoDates
      ? (activitiesCount / weeksBetweenTwoDates).toFixed(2)
      : userActivities.length;

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
      const activitiesDone = userActivities.filter(
        (activity) => activity.date <= new Date() && activity.isDone
      );
      const activityTypeCounts = activitiesDone.reduce<{ [key: string]: number }>(
        (counts, activity) => {
          const activityType = activity.type.type;
          if (activityTypes.includes(activityType)) {
            counts[activityType] = (counts[activityType] || 0) + 1;
          }
          return counts;
        },
        {}
      );

      const distributionPerActivityType = Object.keys(activityTypeCounts).map((type) => ({
        name: type,
        value: activityTypeCounts[type]
      }));

      return {
        distributionPerActivityType,
        totalDone: activitiesDone.length
      };
    };
    const activityTypeDistribution = await getActivityTypeDistribution();
    const mostCommonExercise = getMostCommonExercise(allExercises);

    const activitiesStatistics = {
      activitiesCount,
      daysSinceLastActivity,
      averageActivitiesPerWeek,
      mostCommonExercise
    };

    const totals = userActivities.reduce<Totals>(
      (activityAcc, activity) => {
        const activityTotals = activity.exercises.reduce<Totals>(
          (exerciseAcc, exercise) => {
            const exerciseTotals = exercise.sets.reduce<Totals>(
              (setAcc, currSet) => {
                return {
                  weightLifted:
                    setAcc.weightLifted +
                    (currSet.load || 0) * (currSet.reps || 1) * (currSet.repeatCount || 1),
                  reps: setAcc.reps + (currSet.reps || 0) * (currSet.repeatCount || 1),
                  distance: setAcc.distance + (currSet.distance || 0) * (currSet.repeatCount || 1)
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

      const data: Record<string, any> = {
        value: 0
      };

      activitiesFromLast12Months.forEach((activity) => {
        if (formatDateToMonth(activity.date) === month) {
          data.fullMonthName = format(activity.date, 'LLLL');
          data.value++;
          if (activityTypes.includes(activity.type.type)) {
            data[activity.type.type] = (data[activity.type.type] || 0) + 1;
          }

          if (!activity.isDone) {
            data.unresolved = (data.unresolved || 0) + 1;
          }
        }
      });

      const [monthName] = month.split('-');

      return { ...data, name: monthName };
    });

    return {
      totals,
      activitiesStatistics,
      activitiesInYear,
      activityTypeDistribution
    };
  }
}
