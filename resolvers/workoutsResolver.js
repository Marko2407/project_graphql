const Workout = require('../models/Workout')

const daysInWeek = [
    "Sunday", "Monday" , "Tuesday",  "Wednesday", "Thursday", "Friday", "Saturday"
]

const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
  }

const removeTime = (date) =>{
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}  

const resolvers = {
    Query:{
        getAllWorkouts: async()=> {
           const workout = await Workout.find()
        return workout
        },
        getWorkoutById: async(_parent, {id}, _context, _info)=>{
            return await Workout.findById(id)
        },

        getWorkoutByDate: async (parent, args, context, info) => {
            const date = removeTime(new Date(args.date))
            if(!isValidDate(date)) return []
            const workouts = await Workout.find({ 'dateCreated' : date})
            return workouts
        },
        getWorkoutByDateRange: async(parent, args, context, info) => {
            let beforeDate = removeTime(new Date(args.before))
                let afterDate  = removeTime(new Date(args.after))
                if(!isValidDate(beforeDate)){
                    beforeDate = removeTime(new Date(Date.now())) 
                }
                if(!isValidDate(afterDate)){
                    afterDate = removeTime(new Date(Date.now())) 
                }
               
                const workouts = await Workout.find({
                     "dateCreated": {$gte: beforeDate, $lte: afterDate }
                  })
                  return workouts
        },
        getWorkoutForCurrentWeek: async(parent, args, context, info) => {
            var curr = new Date;
            var firstday =removeTime(new Date(curr.setDate(curr.getDate() - curr.getDay()+ 1)))
            var lastday = removeTime(new Date(curr.setDate(curr.getDate() - curr.getDay()+7)))
            console.log(firstday);
            console.log(lastday);
                const workouts = await Workout.find({
                     "dateCreated": {$gte: firstday, $lte: lastday }
                  }).sort({  "dateCreated": +1 })
                  return workouts
        },

        getWorkoutBySearchInput: async(parent, args, context, info) => {
           return await Workout.find({ $or : [
                { 'title':{ '$regex': args.title , '$options': 'i' } },
                { 'description': { '$regex': args.title , '$options': 'i' } },
              ]})
        },
    }, 

    Mutation:{
        createWorkout: async (parent, args, context, info) => {
            let date = new Date(Date.now())

            if(args.dateCreated != null){
                date =  new Date(args.dateCreated)
                if((!isValidDate(date))){
                    date = new Date(Date.now())
                }
            }
            
            const dayt = daysInWeek.at(date.getDay())

            date = removeTime(date)

            const {day, title, description, dateCreated} = args  
            const workout = new Workout({day: dayt, title: title, description:  description,  dateCreated: date})
            await workout.save()
            return workout
        }, 

        deleteWorkout: async (paret, args, context, info) => {
            const{ id} = args
            await Workout.findByIdAndDelete(id)
            return true
        },

        updateWorkout: async(paret, args, context, info) => {
            const{id} = args
            const {title} = args
            const {description} = args
            const{dateCreated} = args
            const updates = {}
            if(title !== undefined){
                updates.title = title
            }
            if(description !==undefined){
                updates.description = description
            }
            if(dateCreated !== undefined){
                updates.dateCreated = removeTime(new Date(dateCreated))
                updates.day =  daysInWeek.at(updates.dateCreated.getDay())
            }

            const workout = await Workout.findByIdAndUpdate(id, updates,{new: true})
            return workout
        },
    }
};


module.exports = resolvers;