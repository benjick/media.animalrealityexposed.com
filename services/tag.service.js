const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')
const { moleculerGql: gql } = require('moleculer-apollo-server')

module.exports = {
  name: 'tag',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'tag',
    define: {
      name: Sequelize.STRING
    }
  },
  settings: {
    graphql: {
      type: gql`
        type Tag {
          id: ID!
          name: String!
          media: [Media!]!
        }
      `,
      resolvers: {
        Tag: {
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
    getTags: {
      graphql: {
        query: gql`
          type Query {
            getTags: [Tag!]!
          }
        `
      },
      handler() {
        return []
      }
    }
  }
}
