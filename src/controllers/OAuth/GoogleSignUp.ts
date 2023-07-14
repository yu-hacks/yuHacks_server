import { Profile } from "passport";
import { callbackURLGoogle, googleClientID, googleClientSecret } from "../../utils/config";
import { IUser, UserRole } from "../../models/User";
import {userMongoService} from "../../index"
import saveUser from "./AuthUtil";
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

declare global {
  namespace Express {
    interface User {
      _json: {
          given_name: string,
          family_name: string,
          email: string,
          sub: string
      }
    }
  }
}

export default function googleSignUpModule() {
    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: callbackURLGoogle
      },
      function(accessToken: string, refreshToken: string, profile: Profile, cb: any) {    
        const name = processUserName(profile) 
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
      }
    ));
}


function processUserName(profile: Profile): [string,string] {
  if(profile.name){
    return [profile.name.givenName, profile.name.familyName] 
  }else{
    const fullName = profile.displayName.split(' ')
    return [fullName[0],fullName[1]]
  }
}