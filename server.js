if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

MONGODB_URI = mongodb+srv://user:user@mbdemo.krcxe.mongodb.net/?retryWrites=true&w=majority

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const workoutResolvers = require("./resolvers/workoutsResolver");
const userResolvers = require("./resolvers/userResolver");
const activitiesResolvers = require("./resolvers/activityResolver");
const mongoose = require("mongoose");

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: [workoutResolvers, userResolvers, activitiesResolvers],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app });

  app.use((req, res) => {
    res.send("Hello from express appolo server");
  });

  await mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log("Mongoose connected...");

  let port = process.env.PORT || 4000;

  app.listen(port, () => console.log("Server is running " + port));
}

startServer();
