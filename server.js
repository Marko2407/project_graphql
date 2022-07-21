const express = require('express')
const{ ApolloServer, gql } = require('apollo-server-express')
const typeDefs = require('./typeDefs') 
const workoutResolvers = require('./resolvers/workoutsResolver')
const userResolvers = require('./resolvers/userResolver')
const activitiesResolvers = require('./resolvers/activityResolver')
const mongoose = require('mongoose')

async function startServer(){
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: [workoutResolvers, userResolvers, activitiesResolvers],
    });

    await apolloServer.start()

    apolloServer.applyMiddleware({app: app})

    app.use((req, res) => {
        res.send("Hello from express appolo server")
    })

    await mongoose.connect('mongodb://localhost:27017/mb_demo_db',{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

    console.log('Mongoose connected...')

    app.listen(4000,() => console.log('Sever is running on port 4000'))
}

startServer()