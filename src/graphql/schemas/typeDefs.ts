import { gql } from 'apollo-server-express';


export const typeDefs = gql`
    enum UserRole {
        PENDING
        HACKER
        SPONSOR
        ADMIN
    }

    type User {
        userId: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        registrationDate: String!
        role: UserRole!
        emailVerified: Boolean!
        passwordResetToken: String!
        team: ID!

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

   input RegistrationInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
   }

   input HackerApplicationInput {
    userId: ID!
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
    user(userId: ID!): User
   }

   type Mutation {
    registerUser(input: RegistrationInput!): User!
    applyHacker(input: HackerApplicationInput!): User!
   }
`;
