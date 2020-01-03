const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')
const { moleculerGql: gql } = require('moleculer-apollo-server')

module.exports = {
  name: 'media',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  settings: {
    graphql: {
      type: gql`
        enum MediaTypes {
          IMAGE
        }
        type Media {
          id: ID!
          type: MediaTypes
          createdAt: String!
          updatedAt: String!
          date: String!
          # tags: [Tag!]!
          # event: Event
          owner: User!
          original: String
          resized: String
          thumbnail: String
          # album: Album
        }
      `,
      resolvers: {
        User: {
          media: {
            action: 'media.get',
            rootParams: {
              categories: 'id'
            }
          }
        }
      }
    }
  },
  model: {
    name: 'media',
    define: {
      type: Sequelize.ENUM('IMAGE'),
      date: Sequelize.DATEONLY,
      original: Sequelize.STRING,
      resized: Sequelize.STRING,
      thumbnail: Sequelize.STRING
    }
  },
  actions: {
    find: {
      graphql: {
        query: gql`
          type Query {
            getMedia(
              limit: Int
              offset: Int
              sort: String
              search: String
              searchFields: String
            ): [Media!]!
          }
        `
      }
    }
  }
}
