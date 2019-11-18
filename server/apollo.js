const { ApolloServer, gql } = require('apollo-server-express')
const { prisma } = require('../generated/prisma')
const AuthService = require('./AuthService')

const typeDefs = gql`
  type Query {
    users: [User!]!
    events: [Event!]!
    myAlbums: [Album!]!
    tags: [Tag!]!
    getImage(id: String!): Media!
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
    owner: User!
    original: String
    resized: String
    thumbnail: String
    album: Album
  }

  type Mutation {
    authenticateUser(username: String!, password: String!): UserLogin!
    uploadMedia(
      tags: [String!]!
      event: String
      album: String
      original: String!
      resized: String!
      thumbnail: String!
    ): Media!
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
    },
    uploadMedia: (parent, args, ctx, info) => {
      const owner = ctx.user.data._id
      if (!owner) {
        throw new Error('Log in please')
      }
      args.owner = {
        connect: {
          id: owner
        }
      }
      if (args.event) {
        args.event = {
          connect: {
            id: args.event
          }
        }
      }
      if (args.album) {
        args.album = {
          connect: {
            id: args.album
          }
        }
      }
      args.date = '2019-11-18'
      args.type = 'IMAGE'
      args.tags = {
        connect: args.tags.map((tag) => ({
          id: tag
        }))
      }
      try {
        return ctx.prisma.createMedia(args)
      } catch (error) {
        console.log('error', error)
      }
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
    },
    getImage: (parent, args, ctx, info) => {
      console.log('getImage', args)
      return ctx.prisma.media({ id: args.id })
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
    },
    owner: (parent, args, ctx, info) => {
      return ctx.prisma.media({ id: parent.id }).owner()
    },
    album: (parent, args, ctx, info) => {
      return ctx.prisma.media({ id: parent.id }).album()
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
