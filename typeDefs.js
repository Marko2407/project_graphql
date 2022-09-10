const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Workout {
    id: ID
    userId: ID
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
    username: String
    password: String
  }

  type SearchResponse {
    day: String
    date: String
    workouts: [Workout]
  }

  type Activity {
    id: ID
    userId: ID
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
    userId: ID
    week: String
    weeklyActivities: [Activity]
    totalSteps: Int
  }

  type DateRange {
    firstDay: String
    lastDay: String
  }

  type Query {
    getTodayWorkouts(userId: ID, today: String): [Workout]
    getWorkoutBySearchInput(searchInput: String, userId: ID): [SearchResponse]
    getWorkoutForSelectedWeek(date: String, userId: ID): [WeeklyWorkouts]

    loginUser(username: String, password: String): User
    getUser(userId: ID): User

    getTodayActivity(userId: String): Activity
    getWeeklyActivities(userId: String): ActivityWithTotalSteps
    getMonthlyActivities(date: String, userId: String): [MonthlyActivities]

    #NE KORISTI SE
    getAllWorkouts(userId: ID): [Workout]
    getCurrentWeekWorkouts(userId: ID): [WeeklyWorkouts]
    getWeeklykWorkoutsByDate(date: String, userId: ID): [WeeklyWorkouts]
    getWorkoutById(id: ID): Workout
    getWorkoutByDate(date: String): [Workout]
    getWorkoutByDateRange(before: String, after: String, userId: ID): [Workout]
    getAllWorkoutForCurrentWeek(userId: ID): [Workout]
    getAllUsers: [User]
    getAllActivities(userId: String): [Activity]
  }

  type Mutation {
    #WORKOUTS
    createWorkout(
      userId: ID
      day: String
      title: String
      description: String
      dateCreated: String
      reps: Int
      series: Int
      username: String
      password: String
    ): Workout

    #USER
    createUser(
      firstName: String
      lastName: String
      weight: Int
      height: Int
      username: String
      password: String
    ): User
    deleteUser(id: ID): Boolean
    updateUser(
      id: String
      firstName: String
      lastName: String
      weight: Int
      height: Int
    ): User
    #ACTIVITY
    createNewTodayActivity(steps: Int, userId: String): Activity
    updateTodayActivity(steps: Int, userId: String): Activity

    #NE KORISTI SE
    updateWorkout(
      id: ID
      title: String
      description: String
      dateCreated: String
    ): Workout
    deleteWorkout(id: ID): Boolean
    updateActivityById(id: ID, steps: Int): Activity
  }
`;

module.exports = typeDefs;
