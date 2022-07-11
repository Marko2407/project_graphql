# mb_project_graphql

To start this project you need to have instaled: node.js, npm, graphql, mongoose and MongoDb 

To install node.js: 
      on Mac -> brew install node   
      on Windows -> download .tar.gz file  https://nodejs.org/en/download/ , install node.js

npm i express apollo-server-express graphql mongoose   

npm i --save-dev-nodemon

npm i mongoose

npm i body-parser

To start mongodb/brew/mongodb-community now and restart at login:
  brew services start mongodb/brew/mongodb-community
Or, if you don't want/need a background service you can just run:
  mongod --config /opt/homebrew/etc/mongod.conf

You need to have all instaled before run dev

To start localHost in terminal write npm run dev and then go to browser and in url type localHost:4000/graphql



Query documentation : 

    getAllWorkouts:[Workout]  - get all workouts from database, return list of Workout object


    getCurrentWeekWorkouts:[WeeklyWorkouts] -  get workouts for current week from database, return list of days with list of Workout object (exmpl data = [day: Monday, list[Workout],day: Tuesday, list[Workout])


    getWeeklykWorkoutsByDate(date: String):[WeeklyWorkouts] - get weekly workouts for given date which is used to calculate given date to weekly date Range (exmpl. given date is 11.07.2022 (Monday, first day of the week), 
    after calcution (11.07.2022 - 18.07.2022))


    getWorkoutById(id: ID): Workout - get workout by its ID


    getWorkoutByDate(date: String): [Workout] -  get workout for given date which is received from client side 


    getTodayWorkouts: [Workout] - get list of current day workouts


    getWorkoutByDateRange(before: String, after: String): [Workout] get list of workouts by date range


    getAllWorkoutForCurrentWeek: [Workout] - get list of weekly workouts for current week


    getWorkoutBySearchInput(title: String): [Workout] - get list of workouts where title or description correscpond searchInput
     

    getWorkoutForSelectedWeek(weeklyOffset: Int):[WeeklyWorkouts] - get list of weekly workouts. weeklyOffset is data of type Integer which is used to subract week from current to a certain week from which is created date range. With new date range is created query for receiving workouts.