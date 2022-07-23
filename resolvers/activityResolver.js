const Activity = require('../models/Activity');
const WeeklyActivities = require('../models/WeeklyActivities');
const MonthlyActivity = require('../models/MonthlyActivities');

const filterActivitiesByDay = (activity, day) => {
  return activity.filter((activity) => activity.day == day);
};

function calculateTotalSteps(activities){
  let totalSteps = 0
  activities.forEach((element) =>{
    totalSteps += element.totalSteps
  })
  return totalSteps
}

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

function mapDailyActivity(activity, day){
  if(activity == null) return {day:day}
  return {
    day: day,
    dateCreated: activity.dateCreated,
    steps: activity.steps,
    totalSteps: activity.totalSteps
  }
}

function mapWeeklyActivities(
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
){
  return [
    Activity(
      mapDailyActivity(monday,daysInWeek[1])),
    Activity(
      mapDailyActivity(tuesday,daysInWeek[2])),
    Activity(
      mapDailyActivity(wednesday,daysInWeek[3])),
    Activity(
      mapDailyActivity(thursday,daysInWeek[4])), 
    Activity(
      mapDailyActivity(friday,daysInWeek[5])), 
    Activity(
      mapDailyActivity(saturday,daysInWeek[6])), 
    Activity(
      mapDailyActivity(sunday,daysInWeek[0]))
    ]
};


//kako range vraca ako datum prelazi mjesec npr 1.8 je u subotu ...
function mapMonthlyActivities(){

}

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
    },
    getWeeklyActivities: async() =>{
      const today = removeTime(new Date());
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 1)
      ); // Monday
      const lastDay = new Date(
        today.setDate(today.getDate() - today.getUTCDay() + 7)
      ); // Sunday

      console.log(firstDay);
      console.log(lastDay);
      const activities = await Activity.find({
        dateCreated: { $gte: firstDay, $lte: lastDay },
      });

   
      const sunday = filterActivitiesByDay(activities, daysInWeek[0]);
      const monday = filterActivitiesByDay(activities, daysInWeek[1]);
      const tuesday = filterActivitiesByDay(activities, daysInWeek[2]);
      const wednesday = filterActivitiesByDay(activities, daysInWeek[3]);
      const thursday = filterActivitiesByDay(activities, daysInWeek[4]);
      const friday = filterActivitiesByDay(activities, daysInWeek[5]);
      const saturday = filterActivitiesByDay(activities, daysInWeek[6]);
      
      const steps = calculateTotalSteps(activities)
     
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
        totalSteps: steps
       }
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