const Workout = require("../models/Workout");
const WeeklyWorkouts = require("../models/WeeklyWorkouts");
const { response } = require("express");
const dateUtils = require("../dateUtils.js");

function isDateAlreadyInList(list, terms) {
  let answer = false;
  list.forEach((e) => {
    if (e.getDate() == terms.getDate()) {
      answer = true;
    } else {
      answer = false;
    }
  });
  return answer;
}

const filterWorkoutByDay = (workout, day) => {
  return workout.filter((workout) => workout.day == day);
};

const mapWorkouts = (
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
) => {
  if (
    monday.length == 0 &&
    tuesday.length == 0 &&
    wednesday.length == 0 &&
    thursday.length == 0 &&
    friday.length == 0 &&
    saturday.length == 0 &&
    sunday.length == 0
  ) {
    return [];
  } else {
    return [
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[1],
        workouts: monday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[2],
        workouts: tuesday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[3],
        workouts: wednesday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[4],
        workouts: thursday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[5],
        workouts: friday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[6],
        workouts: saturday,
      }),
      WeeklyWorkouts({
        day: dateUtils.daysInWeek[0],
        workouts: sunday,
      }),
    ];
  }
};

const resolvers = {
  Query: {
    getTodayWorkouts: async (_parent, { userId, today }, _context, _info) => {
      const date = dateUtils.removeTime(new Date(parseInt(today)));
      if (!dateUtils.isValidDate(date)) return [];
      const workouts = await Workout.find({
        userId: userId,
        dateCreated: date,
      });
      console.log(workouts);
      return workouts;
    },
    getWorkoutForSelectedWeek: async (_parent, args, _context, _info) => {
      const today = dateUtils.removeTime(new Date(parseInt(args.date)));
      console.log(today);
      if (!dateUtils.isValidDate(today)) return [];

      const date = dateUtils.getDateRangeOfWeek(today.getWeek());

      console.log("date range: " + date.from + " - " + date.to);

      const lastDay = new Date(date.to);
      console.log(lastDay);

      const last = new Date(
        today.setDate(lastDay.getDate() - lastDay.getUTCDay() + 7)
      );

      const workout = await Workout.find({
        userId: args.userId,
        dateCreated: { $gte: date.from, $lte: date.to },
      });

      console.log(workout);

      const sunday = filterWorkoutByDay(workout, dateUtils.daysInWeek[0]);
      const monday = filterWorkoutByDay(workout, dateUtils.daysInWeek[1]);
      const tuesday = filterWorkoutByDay(workout, dateUtils.daysInWeek[2]);
      const wednesday = filterWorkoutByDay(workout, dateUtils.daysInWeek[3]);
      const thursday = filterWorkoutByDay(workout, dateUtils.daysInWeek[4]);
      const friday = filterWorkoutByDay(workout, dateUtils.daysInWeek[5]);
      const saturday = filterWorkoutByDay(workout, dateUtils.daysInWeek[6]);

      const weeklyWorkout = mapWorkouts(
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
      );

      return weeklyWorkout;
    },

    getWorkoutBySearchInput: async (_parent, args, _context, _info) => {
      console.log(args.searchInput);
      const searchResult = await Workout.find({
        userId: args.userId,
        $or: [
          { title: { $regex: args.searchInput, $options: "i" } },
          { description: { $regex: args.searchInput, $options: "i" } },
        ],
      });

      let searchResponseList = [];
      let dateCreationMap = [];

      //Provjerava da li se datum vec nalazi unutar liste, (sprjecava dupliciranje datuma)
      searchResult.forEach((response) => {
        if (!isDateAlreadyInList(dateCreationMap, response.dateCreated)) {
          //ako datum ne postoji u listi ubaci novi
          dateCreationMap.push(response.dateCreated);
        }
      });

      // Grupiraj podatke po istom datumu
      dateCreationMap.forEach((date) => {
        searchResponseList.push({
          day: dateUtils.daysInWeek[date.getDay()],
          date: date,
          workouts: searchResult.filter((workout) => {
            return (
              new Date(Date.parse(workout.dateCreated)).toDateString() ==
              date.toDateString()
            );
          }),
        });
      });
      return searchResponseList;
    },
  },

  Mutation: {
    createWorkout: async (_parent, args, _context, _info) => {
      let date = new Date();

      if (args.dateCreated != null) {
        date = new Date(args.dateCreated);
        if (!dateUtils.isValidDate(date)) {
          date = new Date();
        }
      }
      date = dateUtils.removeTime(date);
      const dayt = dateUtils.daysInWeek[date.getDay()];

      const { userId, day, title, description, dateCreated, reps, series } =
        args;
      const workout = new Workout({
        userId: userId,
        day: dayt,
        title: title,
        description: description,
        dateCreated: date,
        reps: reps,
        series: series,
      });
      await workout.save();
      return workout;
    },
  },
};

module.exports = resolvers;
