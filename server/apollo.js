const { ApolloServer, gql } = require('apollo-server-express')
const { prisma } = require('../generated/prisma')

const typeDefs = gql`
  type Query {
    users: [User!]!
    events: [Event!]!
  }

  type User {
    id: ID!
    name: String!
    events: [Event!]!
  }

  type Event {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    date: String!
    owner: User!
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      return ctx.prisma.users({}, `{id name events}`)
    },
    events: (parent, args, ctx, info) => {
      return ctx.prisma.events({}, `{id name date owner}`)
    }
  },
  User: {
    events: (parent, args, ctx, info) => {
      return ctx.prisma.user({ id: parent.id }, `{id name date}`).events()
    }
  },
  Event: {
    owner: (parent, args, ctx, info) => {
      return ctx.prisma.event({ id: parent.id }, `{id name}`).owner()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { prisma }
  }
})

module.exports = server
