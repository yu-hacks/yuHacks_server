const express = require("express");
const expressGraphql = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import User, { IUser, UserRole, AppStatus } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../controllers/verificationEmail';
import { connect } from 'mongoose';
import { typeDefs } from '../schemas/typeDefs';
import { Args } from 'type-graphql';
import { ApolloError, ApolloServer } from 'apollo-server-express';
import stream from "stream";
import {s3, bucket} from '../../utils/aws-config';

const { createWriteStream } = require("fs");

export const createUploadStream = (key: string) =>{
  const pass = new stream.PassThrough();

  return{
    writeStream: pass,
    promise: s3.upload({
      Bucket: bucket,
      Key: key,
      Body: pass,
    }).promise(),
  };
};

const resolvers: IResolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_, args: { _id: string }) => {
      return await User.findById(args._id);
    },
    usersSignupsSubmissionsInDay: async () => {
      return await usersSignupsSubmissionsIntervals(2, 1); // 2 (1-day) intervals
    },
    usersSignupsSubmissionsInWeek: async () => {
      return await usersSignupsSubmissionsIntervals(7, 1); // 7 (1-day) intervals
    },
    usersSignupsSubmissionsInMonth: async () => {
      return await usersSignupsSubmissionsIntervals(10, 3); // 10 (3-days) intervals
    },
    appStatusStats: async () => {
      const users: Array<IUser> = await User.find();
      let pendingUsers, rejectedUsers, approvedUsers, waitlistedUsers, incompleteUsers;
      pendingUsers = rejectedUsers = approvedUsers = waitlistedUsers = incompleteUsers = 0;

      for (let i = 0; i < users.length; i++) {
        if (users[i].appStatus == AppStatus.PENDING) {
          pendingUsers++;
        } else if (users[i].appStatus == AppStatus.REJECTED) {
          rejectedUsers++;
        } else if (users[i].appStatus == AppStatus.APPROVED) {
          approvedUsers++;
        }  else if (users[i].appStatus == AppStatus.WAITLISTED) {
          waitlistedUsers++;
        } else {
          incompleteUsers++;
        }
      }

      return { 
        pendingUsers: pendingUsers, 
        rejectedUsers: rejectedUsers, 
        approvedUsers: approvedUsers, 
        waitlistedUsers: waitlistedUsers, 
        incompleteUsers: incompleteUsers
      };
    }
  },
  Upload: require("graphql-upload-minimal").GraphQLUpload,
  Mutation: {
    registerUser: async (
      _,
      args: {
        input: {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        };
      }
    ) => {
      args.input.password = await bcrypt.hash(args.input.password, 10);
      const newUser = new User({ ...args.input, role: UserRole.PENDING, emailVerified: false});
      await newUser.save();
      // if (!sendVerificationEmail(args.input.firstName, args.input.email)) {
      //   console.log("Failed sending verification email to " + args.input.email + ". Trying again.");
      //   sendVerificationEmail(args.input.firstName, args.input.email) ? console.log("Succesfully sent") : console.log("Failed sending again"); 
      // }
      return newUser;
    },

    applyHacker: async (_, { input, file }) => {
      const user = await User.findById(input._id);
    
      if (!user) {
        throw new Error("User not found");
      }

      const {filename, createReadStream} = await file;
     console.log(file);
      let stream = createReadStream();

      let result;

      try{
        const uploadStream = createUploadStream(filename);
        stream.pipe(uploadStream.writeStream);
        result = await uploadStream.promise;
      }
      catch(error: any){
        console.log(`[Error]: Message: ${error.message}, Stack: ${error.stack}`)
        throw new ApolloError("Error uploaidng");
      }
      Object.assign(user, input);
      user.role = UserRole.HACKER;
      user.resume = result.Location;

      await user.save();

      return user;
    },

    loginUser: async (_, args: { input: { email: string; password: string } }) => {
      const user = await User.findOne({ email: args.input.email });

      if (!user) {
        throw new Error("User not found");
      }

      const isEqual = await bcrypt.compare(
        args.input.password,
        user.password.toString()
      );

      if (!isEqual) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign({ _id: user.id, email: user.email }, "xxxx", {
        expiresIn: "1h",
      });

      return { _id: user.id, token: token, tokenExpiration: 1 };
    },
  },
};

const usersSignupsSubmissionsIntervals = async (intervals: number, daysInInterval: number) => {
  const users: Array<IUser> = await User.find();
  let today = new Date();  
  let yesterday = new Date();

  // Init arrays
  let signupCounts: number[] = new Array(intervals); 
  let submissionCounts: number[]  = new Array(intervals);
  for (let i = 0; i < intervals; i++) {
    signupCounts[i] = 0;
    submissionCounts[i] = 0;
  }

  for (let j = intervals - 1; j >= 0; j--) {
    yesterday.setTime(today.getTime() - (daysInInterval * 86400000)); // a day in milliseconds
    for (let i = 0; i < users.length; i++) {
      if (users[i].registrationDate.getTime() > yesterday.getTime() && users[i].registrationDate.getTime() <= today.getTime()) {
        signupCounts[j]++;
      }
      if (users[i].appSubmissionDate !== undefined && users[i].appSubmissionDate.getTime() > yesterday.getTime() && users[i].appSubmissionDate.getTime() <= today.getTime()) {
        submissionCounts[j]++;
      }
    }
    today.setTime(yesterday.getTime());
  }

  return {
    signupCounts: signupCounts,
    submissionCounts: submissionCounts
  };
}

export default resolvers;