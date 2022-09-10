const Activity = require("../models/Activity");
const dateUtils = require("../dateUtils.js");
const t = dateUtils;

const filterActivitiesByDay = (activity, day) => {
  return activity.filter((activity) => activity.day == day);
};

function calculateTotalSteps(activities) {
  let totalSteps = 0;
  activities.forEach((element) => {
    totalSteps += element.totalSteps;
  });
  return totalSteps;
}

function getTotalSteps(steps) {
  let totalSteps = 0;
  steps.forEach((element) => {
    totalSteps += element;
  });
  return totalSteps;
}

function mapDailyActivity(activity, day) {
  if (activity == null) return { day: day };
  return {
    id: activity.id,
    day: day,
    dateCreated: activity.dateCreated,
    steps: activity.steps,
    totalSteps: activity.totalSteps,
  };
}

function mapWeeklyActivities(
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
) {
  return [
    Activity(mapDailyActivity(monday, dateUtils.daysInWeek[1])),
    Activity(mapDailyActivity(tuesday, dateUtils.daysInWeek[2])),
    Activity(mapDailyActivity(wednesday, dateUtils.daysInWeek[3])),
    Activity(mapDailyActivity(thursday, dateUtils.daysInWeek[4])),
    Activity(mapDailyActivity(friday, dateUtils.daysInWeek[5])),
    Activity(mapDailyActivity(saturday, dateUtils.daysInWeek[6])),
    Activity(mapDailyActivity(sunday, dateUtils.daysInWeek[0])),
  ];
}

function mapMonthlyActivities(activities, iterator) {
  const weekNumber = "Tjedan " + iterator;
  const sunday = filterActivitiesByDay(activities, dateUtils.daysInWeek[0]);
  const monday = filterActivitiesByDay(activities, dateUtils.daysInWeek[1]);
  const tuesday = filterActivitiesByDay(activities, dateUtils.daysInWeek[2]);
  const wednesday = filterActivitiesByDay(activities, dateUtils.daysInWeek[3]);
  const thursday = filterActivitiesByDay(activities, dateUtils.daysInWeek[4]);
  const friday = filterActivitiesByDay(activities, dateUtils.daysInWeek[5]);
  const saturday = filterActivitiesByDay(activities, dateUtils.daysInWeek[6]);

  const steps = calculateTotalSteps(activities);

  const dailyActivities = mapWeeklyActivities(
    monday[0],
    tuesday[0],
    wednesday[0],
    thursday[0],
    friday[0],
    saturday[0],
    sunday[0]
  );

  return {
    week: weekNumber,
    weeklyActivities: dailyActivities,
    totalSteps: steps,
  };
}

const activityResolvers = {
  Query: {
    getTodayActivity: async (_parent, args, _context, _info) => {
      const todayDate = dateUtils.removeTime(new Date());
      console.log(todayDate);
      console.log(args.userId)
      const response = await Activity.findOne({  userId: args.userId ,dateCreated: todayDate });
      return response;
    },
    getWeeklyActivities: async (_parent, args, _context, _info) => {
      const today = dateUtils.removeTime(new Date());
      const dates = dateUtils.getDateRangeOfWeek(today.getWeek());

      const activities = await Activity.find({
        userId: args.userId,
        dateCreated: { $gte: dates.from, $lte: dates.to },
      });
      const sunday = filterActivitiesByDay(activities, dateUtils.daysInWeek[0]);
      const monday = filterActivitiesByDay(activities, dateUtils.daysInWeek[1]);
      const tuesday = filterActivitiesByDay(
        activities,
        dateUtils.daysInWeek[2]
      );
      const wednesday = filterActivitiesByDay(
        activities,
        dateUtils.daysInWeek[3]
      );
      const thursday = filterActivitiesByDay(
        activities,
        dateUtils.daysInWeek[4]
      );
      const friday = filterActivitiesByDay(activities, dateUtils.daysInWeek[5]);
      const saturday = filterActivitiesByDay(
        activities,
        dateUtils.daysInWeek[6]
      );
      
      const steps = calculateTotalSteps(activities);
      const dailyActivities = mapWeeklyActivities(
        monday[0],
        tuesday[0],
        wednesday[0],
        thursday[0],
        friday[0],
        saturday[0],
        sunday[0]
      );
      return {
        activities: dailyActivities,
        totalSteps: steps,
      };
    },
    getMonthlyActivities: async (_parent, args, _context, _info) => {
      const date = new Date(parseInt(args.date));
      console.log(date);
      const listRangeDate = dateUtils.getListOfDateRange(date);
      let activities = [];
      for (let i = 0; i < listRangeDate.length; i++) {
        const response = await Activity.find({
          userId: args.userId,
          dateCreated: {
            $gte: listRangeDate[i].firstDay,
            $lte: listRangeDate[i].lastDay,
          },
        });
        //map response to weeks

        activities.push(mapMonthlyActivities(response, i + 1));
        console.log(activities);
      }
      return activities;
    },
  },

  Mutation: {
    createNewTodayActivity: async (_parent, args, _context, _info) => {
      const todayDate = dateUtils.removeTime(new Date());
      const steps = args.steps;
      if (steps == null) return null;
      return await new Activity({
        userId: args.userId,
        day: dateUtils.daysInWeek[todayDate.getDay()],
        steps: [steps],
        totalSteps: steps,
        dateCreated: todayDate,
      }).save();
    },
    updateTodayActivity: async (_parent, args, _context, _info) => {
      const todayDate = dateUtils.removeTime(new Date());
      const steps = args.steps;
      const updates = {};
      if (steps == null) return null;
      const todayActivity = await Activity.findOne({  userId: args.userId ,dateCreated: todayDate });
      if (todayActivity != null) {
        let stepsArray = todayActivity.steps;
        stepsArray.push(steps);
        updates.steps = stepsArray;
        updates.totalSteps = getTotalSteps(stepsArray);

        return await Activity.findByIdAndUpdate(todayActivity.id, updates, {
          new: true,
        });
      }
      return todayWorkout;
    },
  },
};

module.exports = activityResolvers;
