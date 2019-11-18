const { ApolloServer, gql } = require('apollo-server-express')
const { prisma } = require('../generated/prisma')
const AuthService = require('./AuthService')

const typeDefs = gql`
  type Query {
    users: [User!]!
    events: [Event!]!
  }

  type User {
    id: ID!
    name: String!
    events: [Event!]!
    media: [Media!]!
  }

  type Event {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    date: String!
    owner: User!
    media: [Media!]!
  }

  type Tag {
    id: ID!
    name: String!
    media: [Media!]!
  }

  enum MediaTypes {
    IMAGE
  }

  type Media {
    id: ID!
    type: MediaTypes
    createdAt: String!
    updatedAt: String!
    date: String!
    tags: [Tag!]!
    event: Event
    owner: User!
    url: String!
  }

  type Mutation {
    # This mutation takes id and email parameters and responds with a User
    authenticateUser(username: String!, password: String!): UserLogin
  }

  type UserLogin {
    id: ID!
    email: String!
    token: String!
    name: String!
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Mutation: {
    authenticateUser: async (parent, args, ctx, info) => {
      const { username, password } = args
      const result = await AuthService.Login(username, password)
      return result
    }
  },
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
      return ctx.prisma.user({ id: parent.id }).events()
    },
    media: (parent, args, ctx, info) => {
      return ctx.prisma.user({ id: parent.id }).media()
    }
  },
  Event: {
    owner: (parent, args, ctx, info) => {
      return ctx.prisma.event({ id: parent.id }).owner()
    }
  },
  Media: {
    tags: (parent, args, ctx, info) => {
      return ctx.prisma.media({ id: parent.id }).tags()
    },
    event: (parent, args, ctx, info) => {
      return ctx.prisma.media({ id: parent.id }).event()
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
