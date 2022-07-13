const { gql } = require('apollo-server-express')

const typeDefs = gql`

type Workout{
    id: ID
    day: String
    title: String
    description: String
    dateCreated: String
    series: Int
    reps: Int
}

type WeeklyWorkouts{
    day: String
    workouts: [Workout]
}

type User{
    id:ID
    firstName: String
    lastName: String
    weight: Int
    height: Int
}

type Query{
    getAllWorkouts:[Workout]
    getCurrentWeekWorkouts:[WeeklyWorkouts]
    getWeeklykWorkoutsByDate(date: String):[WeeklyWorkouts]
    getWorkoutById(id: ID): Workout
    getWorkoutByDate(date: String): [Workout]
    getTodayWorkouts: [Workout]
    getWorkoutByDateRange(before: String, after: String): [Workout]
    getAllWorkoutForCurrentWeek: [Workout]
    getWorkoutBySearchInput(searchInput: String): [Workout],
    getWorkoutForSelectedWeek(weeklyOffset: Int):[WeeklyWorkouts]
    getUser: User
    getAllUsers: [User]
}

type Mutation {
    createWorkout(day: String, title: String, description: String, dateCreated: String, reps: Int, series: Int): Workout
    deleteWorkout(id: ID): Boolean
    updateWorkout(id: ID, title: String, description: String, dateCreated: String): Workout
    createUser(firstName: String, lastName: String, weight: Int, height: Int): User
    deleteUser(id: ID): Boolean
    updateUser(id: ID, firstName: String, lastName: String, weight: Int, height: Int): User
   
}`;

module.exports = typeDefs;
