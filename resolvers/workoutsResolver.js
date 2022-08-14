const Workout = require("../models/Workout");
const WeeklyWorkouts = require("../models/WeeklyWorkouts");
const { response } = require("express");
const dateUtils = require("../dateUtils.js");

function findAnswer(list, terms) {
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
    getAllWorkouts: async () => {
      const workout = await Workout.find();
      return workout;
    },

    getCurrentWeekWorkouts: async () => {
      const today = dateUtils.removeTime(new Date());

      const firstDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 7)
      ); // Sunday

      console.log(firstDay);
      console.log(lastDay);
      const workout = await Workout.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });
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

    getWeeklykWorkoutsByDate: async (_parent, args, _context, _info) => {
      const today = dateUtils.removeTime(new Date(args.date));
      if (!dateUtils.isValidDate(today)) return [];
      console.log(today);
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 7)
      ); // Sunday

      const workout = await Workout.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });

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

    getWorkoutById: async (_parent, { id }, _context, _info) => {
      return await Workout.findById(id);
    },

    getWorkoutByDate: async (_parent, args, _context, _info) => {
      const date = dateUtils.removeTime(new Date(args.date));
      if (!dateUtils.isValidDate(date)) return [];
      const workouts = await Workout.find({ dateCreated: date });
      return workouts;
    },

    getTodayWorkouts: async (_parent, args, _context, _info) => {
      const date = dateUtils.removeTime(new Date());
      if (!dateUtils.isValidDate(date)) return [];
      const workouts = await Workout.find({ dateCreated: date });
      return workouts;
    },
    getWorkoutByDateRange: async (_parent, args, _context, _info) => {
      let beforeDate = dateUtils.removeTime(new Date(args.before));
      let afterDate = dateUtils.removeTime(new Date(args.after));
      if (!dateUtils.isValidDate(beforeDate)) {
        beforeDate = dateUtils.removeTime(new Date(Date.now()));
      }
      if (!dateUtils.isValidDate(afterDate)) {
        afterDate = dateUtils.removeTime(new Date(Date.now()));
      }

      const workouts = await Workout.find({
        dateCreated: { $gte: beforeDate, $lte: afterDate },
      });
      return workouts;
    },
    getAllWorkoutForCurrentWeek: async (_parent, _args, _context, _info) => {
      const today = dateUtils.removeTime(new Date());
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 7)
      ); // Sunday

      console.log(firstDay);
      console.log(lastDay);
      const workouts = await Workout.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      }).sort({ dateCreated: +1 });
      return workouts;
    },

    getWorkoutForSelectedWeek: async (_parent, args, _context, _info) => {
      const today = dateUtils.removeTime(new Date(parseInt(args.date)));
      console.log(today);
      if (!dateUtils.isValidDate(today)) return [];

      const date = dateUtils.getDateRangeOfWeek(today.getWeek());

      console.log("date range: " + date.from + " - " + date.to);
      const workout = await Workout.find({
        dateCreated: { $gte: date.from, $lt: date.to },
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
      const searchResult = await Workout.find({
        $or: [
          { title: { $regex: args.searchInput, $options: "i" } },
          { description: { $regex: args.searchInput, $options: "i" } },
        ],
      });

      let searchResponseList = [];
      let dateCreationMap = [];

      searchResult.forEach((response) => {
        if (!findAnswer(dateCreationMap, response.dateCreated)) {
          dateCreationMap.push(response.dateCreated);
        }
      });

      dateCreationMap.forEach((date) => {
        searchResponseList.push({
          day: dateUtils.daysInWeek[date.getDay()],
          date: date,
          workout: searchResult.filter((workout) => {
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

      const { day, title, description, dateCreated, reps, series } = args;
      const workout = new Workout({
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

    deleteWorkout: async (_paret, args, _context, _info) => {
      const { id } = args;
      await Workout.findByIdAndDelete(id);
      return true;
    },

    updateWorkout: async (_paret, args, _context, _info) => {
      const { id } = args;
      const { title } = args;
      const { description } = args;
      const { dateCreated } = args;
      const updates = {};
      if (title !== undefined) {
        updates.title = title;
      }
      if (description !== undefined) {
        updates.description = description;
      }
      if (dateCreated !== undefined) {
        updates.dateCreated = dateUtils.removeTime(new Date(dateCreated));
        updates.day = dateUtils.daysInWeek[updates.dateCreated.getDay()];
      }

      const workout = await Workout.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return workout;
    },
  },
};

module.exports = resolvers;
