const Workout = require('../models/Workout')

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
            console.log(args.date);
            date = new Date(args.date).toLocaleDateString()
            const workouts = await Workout.find({ 'dateCreated' : date})
            return workouts
        }
    }, 

    Mutation:{
        createWorkout: async (parent, args, context, info) => {
            let date = new Date(Date.now()).toLocaleDateString()

            if(args.dateCreated != null){
                date =  new Date(args.dateCreated)
                if(date != Date){
                    date = new Date(Date.now()).toLocaleDateString()
                }
            }

            console.log(d);
            const {day, title, description, dateCreated} = args  
            const workout = new Workout({day, title: title, description:  description,  dateCreated: date})
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
            const updates = {}
            if(title !== undefined){
                updates.title = title
            }
            if(description !==undefined){
                updates.description = description
            }
            const workout = await Workout.findByIdAndUpdate(id, {title, description},{new: true})
            return workout
        },
    }
};


module.exports = resolvers;