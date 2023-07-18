import { gql } from 'apollo-server-express';
import {Upload} from   "graphql-upload-minimal"; 


export const typeDefs = gql`
    enum UserRole {
        PENDING
        HACKER
        SPONSOR
        ADMIN
    }

    scalar Upload

    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        registrationDate: String!
        role: UserRole!
        emailVerified: Boolean!
        passwordResetToken: String!
        team: ID!
        token: String
        tokenExpiration: Int

        school: String
        year: String
        website: String
        github: String
        linkedin: String
        resume: String
        allergies: String
        dietaryNeeds: String
        clothingSize: String
    }

    type Verification {
        email: String!
        verificationToken: String!
        date: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

   input RegistrationInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
   }
   
   input GoogleAuthInput {
    token: String!
   }

   input HackerApplicationInput {
    _id: ID!
    school: String!
    year: String!
    website: String
    github: String
    linkedin: String
    resume: String
    allergies: String
    dietaryNeeds: String
    clothingSize: String
   }

   type Query {
    users: [User!]!
    user(_id: ID!): User
   }

   type Mutation {
    loginUser(input: LoginInput!): User!
    registerUser(input: RegistrationInput!): User!
    applyHacker(input: HackerApplicationInput!, file:Upload ): User!
    authGoogleuser(input: GoogleAuthInput!): User!
    
    
   }
`;