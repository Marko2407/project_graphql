const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Workout {
    id: ID
    day: String
    title: String
    description: String
    dateCreated: String
    series: Int
    reps: Int
  }

  type WeeklyWorkouts {
    day: String
    workouts: [Workout]
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    weight: Int
    height: Int
  }

  type SearchResponse {
    day: String
    date: String
    workouts: [Workout]
  }

  type Activity {
    id: ID
    day: String
    dateCreated: String
    steps: [Int]
    totalSteps: Int
  }

  type ActivityWithTotalSteps {
    activities: [Activity]
    totalSteps: Int
  }

  type WeeklyActivities {
    activities: Activity
  }

  type MonthlyActivities {
    week: String
    weeklyActivities: [Activity]
    totalSteps: Int
  }

  type DateRange {
    firstDay: String
    lastDay: String
  }

  type Query {
    getAllWorkouts: [Workout]
    getCurrentWeekWorkouts: [WeeklyWorkouts]
    getWeeklykWorkoutsByDate(date: String): [WeeklyWorkouts]
    getWorkoutById(id: ID): Workout
    getWorkoutByDate(date: String): [Workout]
    getTodayWorkouts: [Workout]
    getWorkoutByDateRange(before: String, after: String): [Workout]
    getAllWorkoutForCurrentWeek: [Workout]
    getWorkoutBySearchInput(searchInput: String): [SearchResponse]
    getWorkoutForSelectedWeek(date: String): [WeeklyWorkouts]

    getUser: User
    getAllUsers: [User]

    getTodayActivity: Activity
    getAllActivities: [Activity]
    getWeeklyActivities: ActivityWithTotalSteps
    getMonthlyActivities(date: String): [MonthlyActivities]
  }

  type Mutation {
    createWorkout(
      day: String
      title: String
      description: String
      dateCreated: String
      reps: Int
      series: Int
    ): Workout
    deleteWorkout(id: ID): Boolean
    updateWorkout(
      id: ID
      title: String
      description: String
      dateCreated: String
    ): Workout

    createUser(
      firstName: String
      lastName: String
      weight: Int
      height: Int
    ): User
    deleteUser(id: ID): Boolean
    updateUser(
      id: ID
      firstName: String
      lastName: String
      weight: Int
      height: Int
    ): User

    createNewTodayActivity(steps: Int): Activity
    updateTodayActivity(steps: Int): Activity
    updateActivityById(id: ID, steps: Int): Activity
  }
`;

module.exports = typeDefs;
