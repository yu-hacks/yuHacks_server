import express from "express";
import passport, { Profile } from "passport";
import googleSignUpModule from "./controllers/OAuth/GoogleSignUp";
import { connect } from "./mongo.services/MongoConnection";
import GenericMongoService from "./mongo.services/genericMongoService";
import User, { IUser } from "./models/User";
import { signJwt } from "./utils/jwt";
import githubSignUpModule from "./controllers/OAuth/GithubSignUp";

export const userMongoService = new GenericMongoService<IUser>(User);

const app = express()
app.use(passport.initialize());

const main = async () => {
    googleSignUpModule();
    githubSignUpModule();
    
    app.get("/", (_req, res) => {
        res.send("Hello World")
    })

  app.get('/auth/google/login',  passport.authenticate('google', { session: false, scope: ['profile','email'] }))
  app.get('/auth/github/login',  passport.authenticate('github', { session: false, scope: [ 'user:email' ] }))

  app.get('/googleRedirect', function(req, res, next) {
    passport.authenticate('google', function(err: any, user: Profile, info: any) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if(user.emails){
        try{
          userMongoService.findOne({email: user.emails[0].value}).then(userDetails => {
            let token = signJwt({
              email: userDetails.email,
              id: userDetails._id,
              role: userDetails.role.toString()
            })
            res.status(200).send(token)
          })
        }catch(err){
          console.error(err)
          res.status(500).send('Unknown error, please try again with a different email/method of registration')
        }
      }
    })(req, res, next);
  });

  app.get('/githubRedirect', function(req, res, next) {
    passport.authenticate('github', function(err: any, user: Profile, info: any) {
      if (err) {
        console.log(err)
        return next(err); // will generate a 500 error
      }
      if(user.emails){
        try{
          userMongoService.findOne({email: user.emails[0].value}).then(userDetails => {
            let token = signJwt({
              email: userDetails.email,
              id: userDetails._id,
              role: userDetails.role.toString()
            })
            res.status(200).send(token)
          })
        }catch(err){
          console.error(err)
          res.status(500).send('Unknown error, please try again with a different email/method of registration')
        }
      }
    })(req, res, next);
  });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on ${PORT}`))
}

connect();
main()