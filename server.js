if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

  await mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log("Mongoose connected...");

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`
    🚀  Server is ready at ${url}
    📭  Query at https://studio.apollographql.com/dev
  `);
  });
}

startServer();
