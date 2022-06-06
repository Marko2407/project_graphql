const { gql } = require('apollo-server-express')

const typeDefs = gql`

type Workout{
    id: ID
    day: String
    title: String
    description: String
    dateCreated: String
}

type Query{
    getAllWorkouts:[Workout]
    getWorkoutById(id: ID): Workout
    getWorkoutByDate(date: String): [Workout]
    getWorkoutByDateRange(before: String, after: String): [Workout]
    getWorkoutForCurrentWeek: [Workout]
}

type Mutation {
    createWorkout(day: String, title: String, description: String, dateCreated: String): Workout
    deleteWorkout(id: ID): Boolean
    updateWorkout(id: ID, title: String, description: String): Workout
}

`;

module.exports = typeDefs;