const express = require("express");
const expressGraphql = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload-minimal");

import { typeDefs } from '../schemas/typeDefs';
import User, { IUser, UserRole } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Interface } from 'readline';
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
      const newUser = new User({ ...args.input, role: UserRole.PENDING});
      await newUser.save();
      return newUser;
    },
    applyHacker: async (_, { input }) => {
      const user = await User.findById(input._id);

      if (!user) {
        throw new Error("User not found");
      }

      Object.assign(user, input);
      user.role = UserRole.HACKER;
      await user.save();

      return user;
    },

    
    fileUpload: async(root, {file}) => {
      
      const {filename, createReadStream} = await file;

      const stream = createReadStream();

      let result;

      try{
        const uploadStream = createUploadStream(filename);
        stream.pipe(uploadStream.writeStream);
        result = await uploadStream.promise;
      }
      catch(error){
        console.log(`[Error]: Message: ${error.message}, Stack: ${error.stack}`)
        throw new ApolloError("Error uploaidng");
      }
      return result;
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