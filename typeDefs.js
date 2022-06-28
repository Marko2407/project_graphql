const { gql } = require('apollo-server-express')

const typeDefs = gql`

type Workout{
    id: ID
    day: String
    title: String
    description: String
    dateCreated: String
}

type WeeklyWorkouts{
    day: String
    workouts: [Workout]
}

type Query{
    getAllWorkouts:[Workout]
    getCurrentWeekWorkouts:[WeeklyWorkouts]
    getWeeklykWorkoutsByDate(date: String):[WeeklyWorkouts]
    getWorkoutById(id: ID): Workout
    getWorkoutByDate(date: String): [Workout]
    getWorkoutByDateRange(before: String, after: String): [Workout]
    getAllWorkoutForCurrentWeek: [Workout]
    getWorkoutBySearchInput(title: String): [Workout]
}

type Mutation {
    createWorkout(day: String, title: String, description: String, dateCreated: String): Workout
    deleteWorkout(id: ID): Boolean
    updateWorkout(id: ID, title: String, description: String, dateCreated: String): Workout
}

`;

module.exports = typeDefs;