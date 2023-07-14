import { Profile } from "passport";
import { callbackURLGithub, githubClientID, githubClientSecret } from "../../utils/config";
import { IUser, UserRole } from "../../models/User";
import saveUser from "./AuthUtil";
const passport = require('passport')
const gitHubStrategy = require('passport-github2').Strategy;


export default function githubSignUpModule() {
    passport.use(new gitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: callbackURLGithub
      },
      function(accessToken: string, refreshToken: string, profile: Profile, cb: any) {    
        console.log(profile)
        const name = processUsername(profile)
        if(name){
          const userInfo: IUser = {
            emailVerified: true,
            firstName: name[0],
            lastName: name[1],
            email: profile.emails !== undefined ? profile.emails[0].value : " ",
            password: 'undefined',
            role: UserRole.PENDING,
            registrationDate: new Date()
          }
  
          saveUser(userInfo).then(result => {
            console.log(`Issuing token for: ${result.email}, id: ${result._id}`)
            return cb(null,profile)
          })
        }else{
          return cb(null,false)
        }
      }
    ));
}


function processUsername(profile: Profile): [string,string] | undefined{
  if(profile.name){
    const fullName = profile.displayName.split(' ')
    return [fullName[0],fullName[1]]
  }
}