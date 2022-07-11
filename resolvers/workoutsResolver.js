const Workout = require('../models/Workout');
const WeeklyWorkouts = require('../models/WeeklyWorkouts');

const daysInWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

const removeTime = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const filterWorkoutByDay = (workout, day) => {
  return workout.filter((workout) => workout.day == day);
};

function subtractWeeks(numOfWeeks, date = new Date()) {
  return date.setDate(date.getDate() - numOfWeeks * 7);
}

const mapWorkouts = (
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
) => {
  return [
    WeeklyWorkouts({
      day: daysInWeek[1],
      workouts: monday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[2],
      workouts: tuesday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[3],
      workouts: wednesday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[4],
      workouts: thursday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[5],
      workouts: friday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[6],
      workouts: saturday,
    }),
    WeeklyWorkouts({
      day: daysInWeek[0],
      workouts: sunday,
    }),
  ];
};

const resolvers = {
  Query: {
    getAllWorkouts: async () => {
      const workout = await Workout.find();
      return workout;
    },

    getCurrentWeekWorkouts: async () => {
      const today = removeTime(new Date());

      const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      ); // Sunday

      const workout = await Workout.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });
      const sunday = filterWorkoutByDay(workout, daysInWeek[0]);
      const monday = filterWorkoutByDay(workout, daysInWeek[1]);
      const tuesday = filterWorkoutByDay(workout, daysInWeek[2]);
      const wednesday = filterWorkoutByDay(workout, daysInWeek[3]);
      const thursday = filterWorkoutByDay(workout, daysInWeek[4]);
      const friday = filterWorkoutByDay(workout, daysInWeek[5]);
      const saturday = filterWorkoutByDay(workout, daysInWeek[6]);

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
      const today = removeTime(new Date(args.date));
      if (!isValidDate(today)) return [];
      console.log(today);
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      ); // Sunday

      const workout = await Workout.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });

      const sunday = filterWorkoutByDay(workout, daysInWeek[0]);
      const monday = filterWorkoutByDay(workout, daysInWeek[1]);
      const tuesday = filterWorkoutByDay(workout, daysInWeek[2]);
      const wednesday = filterWorkoutByDay(workout, daysInWeek[3]);
      const thursday = filterWorkoutByDay(workout, daysInWeek[4]);
      const friday = filterWorkoutByDay(workout, daysInWeek[5]);
      const saturday = filterWorkoutByDay(workout, daysInWeek[6]);

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
      const date = removeTime(new Date(args.date));
      if (!isValidDate(date)) return [];
      const workouts = await Workout.find({ dateCreated: date });
      return workouts;
    },

    getTodayWorkouts: async (_parent, args, _context, _info) => {
      const date = removeTime(new Date());
      if (!isValidDate(date)) return [];
      const workouts = await Workout.find({ dateCreated: date });
      return workouts;
    },
    getWorkoutByDateRange: async (_parent, args, _context, _info) => {
      let beforeDate = removeTime(new Date(args.before));
      let afterDate = removeTime(new Date(args.after));
      if (!isValidDate(beforeDate)) {
        beforeDate = removeTime(new Date(Date.now()));
      }
      if (!isValidDate(afterDate)) {
        afterDate = removeTime(new Date(Date.now()));
      }

      const workouts = await Workout.find({
        dateCreated: { $gte: beforeDate, $lte: afterDate },
      });
      return workouts;
    },
    getAllWorkoutForCurrentWeek: async (_parent, _args, _context, _info) => {
      var curr = new Date();
      var firstday = removeTime(
        new Date(curr.setDate(curr.getDate() - curr.getDay() + 1))
      );
      var lastday = removeTime(
        new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
      );
      console.log(firstday);
      console.log(lastday);
      const workouts = await Workout.find({
        dateCreated: { $gte: firstday, $lte: lastday },
      }).sort({ dateCreated: +1 });
      return workouts;
    },

    getWorkoutForSelectedWeek: async (_parent, args, _context, _info) => {
      var curr = new Date(subtractWeeks(args.weeklyOffset, curr))
      console.log(curr)

      var firstday = removeTime(
        new Date(curr.setDate(curr.getDate() - curr.getDay() + 1))
      );
      var lastday = removeTime(
        new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
      );

      console.log("date range: " + firstday + " - " + lastday)
      const workout = await Workout.find({
        dateCreated: { $gte: firstday, $lte: lastday },
      });

      const sunday = filterWorkoutByDay(workout, daysInWeek[0]);
      const monday = filterWorkoutByDay(workout, daysInWeek[1]);
      const tuesday = filterWorkoutByDay(workout, daysInWeek[2]);
      const wednesday = filterWorkoutByDay(workout, daysInWeek[3]);
      const thursday = filterWorkoutByDay(workout, daysInWeek[4]);
      const friday = filterWorkoutByDay(workout, daysInWeek[5]);
      const saturday = filterWorkoutByDay(workout, daysInWeek[6]);

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
      return await Workout.find({
        $or: [
          { title: { $regex: args.title, $options: 'i' } },
          { description: { $regex: args.title, $options: 'i' } },
        ],
      });
    },
  },

  Mutation: {
    createWorkout: async (_parent, args, _context, _info) => {
      let date = new Date(Date.now());

      if (args.dateCreated != null) {
        date = new Date(args.dateCreated);
        if (!isValidDate(date)) {
          date = new Date(Date.now());
        }
      }

      const dayt = daysInWeek[date.getDay()];

      date = removeTime(date);

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
        updates.dateCreated = removeTime(new Date(dateCreated));
        updates.day = daysInWeek[updates.dateCreated.getDay()];
      }

      const workout = await Workout.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return workout;
    },
  },
};

module.exports = resolvers;
