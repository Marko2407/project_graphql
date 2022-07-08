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
