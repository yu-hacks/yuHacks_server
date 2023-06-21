import { buildSchema } from 'graphql';

const eventSchema = buildSchema(`
    type Event {
        id: Int!
        name: String!
        description: String!
        date: String!
        time: String!
        location: String!
    }

    input CreateEventInput {
        id: Int!
        name: String!
        description: String!
        date: String!
        time: String!
        location: String!
    }

    input UpdateEventInput {
        id: Int!
        name: String
        description: String
        date: String
        time: String
        location: String
    }

    input GetEventInput {
        id: Int!
    }

    type Query {
        getEvent(id: int!): Event
        getEvent: [Event]
        getEventByName(name: String!): Event
        getEventsByDate(date: String!): [Event]
        getEventsByTime(time: String!): [Event]
        getEventsByLocation(location: String!): [Event]
    }

    type Mutation {
        createEvent(input: CreateEventInput): Event!
        updateEvent(input: UpdateEventInput): Event!
        deleteEvent(input: GetEventInput): Event!
    }

`)

export default eventSchema;