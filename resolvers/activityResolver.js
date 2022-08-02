const Activity = require("../models/Activity");
const dateUtils = require("../dateUtils.js");
const t = dateUtils;
console.log(t);

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
  const weekNumber = "week " + iterator;
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

const todayDate = dateUtils.removeTime(new Date());

const activityResolvers = {
  Query: {
    getTodayActivity: async () => {
      const response = await Activity.findOne({ dateCreated: todayDate });
      console.log(response);
      return response;
    },
    getAllActivities: async () => {
      return await Activity.find();
    },
    getWeeklyActivities: async () => {
      const today = dateUtils.removeTime(new Date());
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      ); // Sunday

      console.log(firstDay);
      console.log(lastDay);
      const activities = await Activity.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });
      console.log(activities);
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
      const today = new Date(parseInt(args.date));
      console.log(today);
      const listRangeDate = dateUtils.getListOfDateRange(today);
      let activities = [];

      for (let i = 0; i < listRangeDate.length; i++) {
        const response = await Activity.find({
          dateCreated: {
            $gte: listRangeDate[i].firstDay,
            $lte: listRangeDate[i].lastDay,
          },
        });
        //map response to weeks

        activities.push(mapMonthlyActivities(response, i + 1));
        console.log(activities);
      }

      //kreira listu datuma range za mjesec!
      return activities;
      // treba kreirati da iz liste pronade sve activitie i spremi za tjedan neki koristit for petlju kako bi se mogao tjedan napraviti
    },
  },

  Mutation: {
    createNewTodayActivity: async (_parent, args, _context, _info) => {
      const steps = args.steps;
      if (steps == null) return null;

      return await new Activity({
        day: dateUtils.daysInWeek[todayDate.getDay()],
        steps: [steps],
        totalSteps: steps,
        dateCreated: todayDate,
      }).save();
    },
    updateTodayActivity: async (_parent, args, _context, _info) => {
      const steps = args.steps;
      const updates = {};
      if (steps == null) return null;
      const todayActivity = await Activity.findOne({ dateCreated: todayDate });
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
    updateActivityById: async (_parent, args, _context, _info) => {
      const steps = args.steps;
      const updates = {};
      if (steps == null) return null;
      const activity = await Activity.findById(args.id);
      if (activity != null) {
        let stepsArray = activity.steps;
        stepsArray.push(steps);

        updates.steps = stepsArray;
        updates.totalSteps = getTotalSteps(stepsArray);

        return await Activity.findByIdAndUpdate(activity.id, updates, {
          new: true,
        });
      }
      return todayWorkout;
    },
  },
};

module.exports = activityResolvers;
