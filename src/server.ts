import express from 'express'
const expressGraphql = require("express-graphql").graphqlHTTP;
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import { Request, Response } from 'express'
import { typeDefs } from './graphql/schemas/typeDefs'
import resolvers from './graphql/resolvers/resolvers'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express';
import { verifyToken } from './controllers/verificationEmail'
import passport, { Profile } from 'passport';
import GenericMongoService from './mongo.services/genericMongoService';
import User, { IUser } from './models/User';
import { signJwt, validateJwt } from './utils/jwt';
import { IAuthenticatedUser } from './models/AuthenticatedUser';
import googleSignUpModule from './controllers/OAuth/GoogleSignUp';
const connectDB = require('./db/index')

const startServer = async() => {
  googleSignUpModule();
    const app = express();

    app.use(cors());
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      context: async ({ req, res }) => {
        if(req.headers.authorization){
          const token = req.headers.authorization.split(' ')[1];
          return validateJwt<IAuthenticatedUser>(token)
        }
      },
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

    app.get('/auth/google/login',  passport.authenticate('google', { session: false, scope: ['profile','email'] }))
    app.get('/googleRedirect', function(req, res, next) {
      passport.authenticate('google', function(err: any, user: Profile, info: any) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if(user.emails){
          try{
            const userMongoService = new GenericMongoService<IUser>(User);
            userMongoService.findOne({email: user.emails[0].value}).then(userDetails => {
              let token = signJwt({
                email: userDetails.email,
                id: userDetails._id,
                role: userDetails.role.toString()
              })
              res.status(200).send({accessToken: token})
            })
          }catch(err){
            console.error(err)
            res.status(500).send('Unknown error, please try again with a different email/method of registration')
          }
        }
      })(req, res, next);
    });
};

startServer();