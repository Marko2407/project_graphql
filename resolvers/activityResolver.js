const Activity = require('../models/Activity');
const WeeklyActivity = require('../models/WeeklyActivities');
const MonthlyActivity = require('../models/MonthlyActivities');

function getTotalSteps(steps){
  let totalSteps = 0
  steps.forEach(element => {
    totalSteps += element
  });
  return totalSteps
}

const daysInWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const removeTime = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const todayDate = removeTime(new Date())

const activityResolvers = {
    Query: {
      getTodayActivity: async() =>{
        return await Activity.findOne({dateCreated: todayDate})
      },
      getAllActivities: async()=>{
        return await Activity.find()
    }
    },

    Mutation: {
      createNewTodayActivity: async (_parent, args, _context, _info) => {
        const steps = args.steps
        if(steps == null) return null
        
        return await new Activity({
          day: daysInWeek[todayDate.getDay()],
          steps:[steps],
          totalSteps: steps,
          dateCreated: todayDate
        }).save()
      },
      updateTodayActivity: async (_parent, args, _context, _info) => {
          const steps = args.steps
          const updates = {}
          if(steps == null) return null
          const todayActivity = await Activity.findOne({dateCreated: todayDate})
          if(todayActivity != null){
          let stepsArray = todayActivity.steps
          stepsArray.push(steps)

          updates.steps = stepsArray
          updates.totalSteps = getTotalSteps(stepsArray)

          return await Activity.findByIdAndUpdate(todayActivity.id, updates, {
            new: true,
          });
            
          }
          return todayWorkout
      },
      updateActivityById: async (_parent, args, _context, _info) => {     
        const steps = args.steps
        const updates = {}
        if(steps == null) return null
        const activity = await Activity.findById(args.id)
        if(activity != null){
        let stepsArray = activity.steps
        stepsArray.push(steps)

        updates.steps = stepsArray
        updates.totalSteps =  getTotalSteps(stepsArray)

        return await Activity.findByIdAndUpdate(activity.id, updates, {
          new: true,
        });
          
        }
        return todayWorkout},
    },
};

module.exports = activityResolvers;