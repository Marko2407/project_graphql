const Activity = require("../models/Activity");
const WeeklyActivities = require("../models/WeeklyActivities");
const MonthlyActivity = require("../models/MonthlyActivities");
const { response } = require("express");
const { parseJSON } = require("date-fns");

//Generira tjedan u trenutnoj godini
Date.prototype.getWeek = function () {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  var week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

//Generira range na temelju broja tjedna
function getDateRangeOfWeek(weekNo) {
  let currentDate, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  currentDate = new Date();
  numOfdaysPastSinceLastMonday = currentDate.getDay() - 1;
  currentDate.setDate(currentDate.getDate() - numOfdaysPastSinceLastMonday);
  currentDate.setDate(
    currentDate.getDate() + 7 * (weekNo - currentDate.getWeek())
  );
  rangeIsFrom =
    currentDate.getMonth() +
    1 +
    "." +
    currentDate.getDate() +
    "." +
    currentDate.getFullYear();
  currentDate.setDate(currentDate.getDate() + 6);
  rangeIsTo =
    currentDate.getMonth() +
    1 +
    "." +
    currentDate.getDate() +
    "." +
    currentDate.getFullYear();
  return {
    from: rangeIsFrom,
    to: rangeIsTo,
  };
}

function getListOfDateRange(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const firstWeekInMonth = firstDayOfMonth.getWeek();
  const lastWeekInMonth = lastDayOfMonth.getWeek();

  let listOfDateRange = [];
  for (let i = firstWeekInMonth; i < lastWeekInMonth; i++) {
    let dateRangeFinder = getDateRangeOfWeek(i);
    listOfDateRange.push({
      firstDay: dateRangeFinder.from,
      lastDay: dateRangeFinder.to,
    });
  }

  return listOfDateRange;
}

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

const daysInWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
    Activity(mapDailyActivity(monday, daysInWeek[1])),
    Activity(mapDailyActivity(tuesday, daysInWeek[2])),
    Activity(mapDailyActivity(wednesday, daysInWeek[3])),
    Activity(mapDailyActivity(thursday, daysInWeek[4])),
    Activity(mapDailyActivity(friday, daysInWeek[5])),
    Activity(mapDailyActivity(saturday, daysInWeek[6])),
    Activity(mapDailyActivity(sunday, daysInWeek[0])),
  ];
}

function mapMonthlyActivities(activities, iterator) {
  const weekNumber = "week " + iterator;
  const sunday = filterActivitiesByDay(activities, daysInWeek[0]);
  const monday = filterActivitiesByDay(activities, daysInWeek[1]);
  const tuesday = filterActivitiesByDay(activities, daysInWeek[2]);
  const wednesday = filterActivitiesByDay(activities, daysInWeek[3]);
  const thursday = filterActivitiesByDay(activities, daysInWeek[4]);
  const friday = filterActivitiesByDay(activities, daysInWeek[5]);
  const saturday = filterActivitiesByDay(activities, daysInWeek[6]);

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

const removeTime = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const todayDate = removeTime(new Date());

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
      const today = removeTime(new Date());
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
      const sunday = filterActivitiesByDay(activities, daysInWeek[0]);
      const monday = filterActivitiesByDay(activities, daysInWeek[1]);
      const tuesday = filterActivitiesByDay(activities, daysInWeek[2]);
      const wednesday = filterActivitiesByDay(activities, daysInWeek[3]);
      const thursday = filterActivitiesByDay(activities, daysInWeek[4]);
      const friday = filterActivitiesByDay(activities, daysInWeek[5]);
      const saturday = filterActivitiesByDay(activities, daysInWeek[6]);

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
      //Treba se iz argsa poslat mjesec za koji se radi datum
      const today = new Date(args.date);
      const listRangeDate = getListOfDateRange(today);
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
        day: daysInWeek[todayDate.getDay()],
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
