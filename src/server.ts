import express from 'express'
const expressGraphql = require("express-graphql").graphqlHTTP;
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import { Request, Response } from 'express'
import { typeDefs } from './graphql/schemas/typeDefs'
import resolvers from './graphql/resolvers/resolvers'
const mongoose = require("mongoose");
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express';
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');

const connectDB = require('./db/index')

const startServer = async() => {
    const app = express();

    app.use(cors());
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      csrfPrevention: true,
      cache: 'bounded',
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  
    });

    app.use(graphqlUploadExpress());
    await server.start();
    server.applyMiddleware({ app, path: '/graphql'});

   
   const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
       graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),

       expressGraphql({ schema: require("./graphql/schemas/typeDefs") })
      console.log(`Server is running on port ${PORT}`);
    });


};

startServer();