const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')
const { moleculerGql: gql } = require('moleculer-apollo-server')

module.exports = {
  name: 'album',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'album',
    define: {
      name: Sequelize.STRING,
      date: Sequelize.DATEONLY
    }
  },
  settings: {
    graphql: {
      type: gql`
        type Album {
          id: ID!
          name: String!
          createdAt: String!
          updatedAt: String!
          owner: User!
          media: [Media!]!
        }
      `,
      resolvers: {
        Album: {
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
  actions: {
    myAlbums: {
      graphql: {
        query: gql`
          type Query {
            myAlbums: [Album!]!
          }
        `
      },
      handler() {
        return []
      }
    }
  }
}
