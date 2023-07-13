import express from 'express'
import { Request, Response } from 'express'
import { typeDefs } from './graphql/schemas/typeDefs'
import resolvers from './graphql/resolvers/resolvers'
const mongoose = require("mongoose");
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express';
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
    });

    await server.start();

    server.applyMiddleware({ app, path: '/graphql'});

    connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });


};

startServer();