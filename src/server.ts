import express from 'express'
const expressGraphql = require("express-graphql").graphqlHTTP;
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import { Request, Response } from 'express'
import { typeDefs } from './graphql/schemas/typeDefs'
import resolvers from './graphql/resolvers/resolvers'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express';
import { verifyToken } from './controllers/verificationEmail'
const connectDB = require('./db/index')

const startServer = async() => {
    const app = express();

    app.use(cors());
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    });

    app.use(graphqlUploadExpress());

    await server.start();

    server.applyMiddleware({ app, path: '/graphql'});

    connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),

       expressGraphql({ schema: require("./graphql/schemas/typeDefs") })
      console.log(`Server is running on port ${PORT}`);
    });

    
    // Custom HTTP Endpoints
    
    app.get('/verifyUser/:verificationToken', async (req, res) => {
      const verificationToken = req.params.verificationToken;
      const statusCode = await verifyToken(verificationToken);

      switch(statusCode) {
        case 200:
          res.status(200).send("User created succesfully");
          break;
        case 404:
          res.status(404).send("Verification token expired, please create an account again");
          break;
        case 500:
          res.status(500).send("Internal server error, please contact an organizer");
          break;
      }
    });
};

startServer();