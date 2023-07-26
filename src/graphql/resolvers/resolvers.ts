const express = require("express");
const expressGraphql = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import User, { UserRole } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../controllers/verificationEmail';
import { ApolloError } from 'apollo-server-express';
const { createWriteStream } = require("fs");
import stream from "stream";
import {s3, bucket} from '../../utils/aws-config';
import { IAuthenticatedUser, IAccessToken } from '../../models/AuthenticatedUser';
import { signJwt } from '../../utils/jwt';
import { GraphQLError } from 'graphql';


export const createUploadStream = (key
  : any) =>{
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
    users: async (_,args,contextValue) => {
      try{
        const user: IAuthenticatedUser = contextValue as IAuthenticatedUser
        if(user.role.toString() == UserRole.ADMIN.toString() || user.role.toString() == UserRole.SPONSOR.toString()){ // return all users 
          return await User.find();
        }else{
          return [] // return empty list for Non admins/sponsors
        }
      }catch(error){
        console.log(error)
        throw new GraphQLError('Authentication error')
      }
      
    },
    user: async (_, args: { _id: string }, contextValue) => {
      try{
        const user: IAuthenticatedUser = contextValue as IAuthenticatedUser
       if(user.role != undefined){
        if(user.role == UserRole.ADMIN || user.id == args._id){
            return await User.findById(args._id);
          }else{
            throw new Error('Higher permissions required')
        }
       }else{
        throw new GraphQLError('Unable to parse user')
       }
      }catch(error: any){
        console.log(error)
        throw new GraphQLError(error.message)
      }

      
    },
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
      if (!sendVerificationEmail(args.input.firstName, args.input.email)) {
        console.log("Failed sending verification email to " + args.input.email + ". Trying again.");
        sendVerificationEmail(args.input.firstName, args.input.email) ? console.log("Succesfully sent") : console.log("Failed sending again"); 
      }

      const accessToken: IAccessToken = {
        token: signJwt({
          email: newUser.email,
          id: newUser._id,
          role: newUser.role.toString()
        })
      }
      return accessToken;
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
      const user = await User.findOne({ email: new RegExp(`^${args.input.email}$`, 'i') });

      if (!user) {
        throw new Error("Email/Password combination is incorrect");
      }

      const isEqual = await bcrypt.compare(
        args.input.password,
        user.password.toString()
      );

      if (!isEqual) {
        throw new Error("Email/Password combination is incorrect");
      }

      const accessToken: IAccessToken = {
        token: signJwt({
          email: user.email,
          id: user._id,
          role: user.role.toString()
        })
      }
      return accessToken;
    },
  },
};

export default resolvers;