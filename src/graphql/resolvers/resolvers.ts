const express = require("express");
const expressGraphql = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import User, { IUser, UserRole } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../controllers/verificationEmail';
import { connect } from 'mongoose';
import { typeDefs } from '../schemas/typeDefs';
import { Args } from 'type-graphql';
import { ApolloError, ApolloServer } from 'apollo-server-express';
const { createWriteStream } = require("fs");
import stream from "stream";
import {s3, bucket} from '../../utils/aws-config';


export const createUploadStream = (key) =>{
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
      console.log("HELLO")
      return await User.find();
    },
    user: async (_, args: { _id: string }) => {
      return await User.findById(args._id);
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
      // try {
      //   await sendVerificationEmail(args.input.firstName, args.input.email)
      // } catch {
      //   console.log(`Failed to send verification email to ${args.input.email}, deleting user.`);
      //   await User.deleteOne(newUser._id)
      //   throw new Error("Something went wrong, please contact an organizer.");
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
      catch(error){
        console.log(`[Error]: Message: ${error.message}, Stack: ${error.stack}`)
        throw new ApolloError("Error uploading");
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

export default resolvers;