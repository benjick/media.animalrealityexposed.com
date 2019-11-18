const { ApolloServer, gql } = require('apollo-server-express')
const { prisma } = require('../generated/prisma')
const AuthService = require('./AuthService')

const typeDefs = gql`
  type Query {
    users: [User!]!
    events: [Event!]!
    myAlbums: [Album!]!
    tags: [Tag!]!
  }

  type User {
    id: ID!
    name: String!
    events: [Event!]!
    media: [Media!]!
    albums: [Album!]!
  }

  type Album {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    owner: User!
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
    album: Album
    owner: User!
    url: String!
  }

  type Mutation {
    authenticateUser(username: String!, password: String!): UserLogin!
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
    myAlbums: (parent, args, ctx, info) => {
      return ctx.prisma.user({ id: ctx.user.data._id }).albums()
    },
    users: (parent, args, ctx, info) => {
      return ctx.prisma.users({}, `{id name events}`)
    },
    events: (parent, args, ctx, info) => {
      return ctx.prisma.events({}, `{id name date owner}`)
    },
    tags: (parent, args, ctx, info) => {
      return ctx.prisma.tags({}, `{id name}`)
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
    const tokenWithBearer = req.headers.authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    const user = AuthService.getUser(token)
    return { prisma, user }
  }
})

module.exports = server
