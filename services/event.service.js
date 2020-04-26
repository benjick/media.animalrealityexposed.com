const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')
const { moleculerGql: gql } = require('moleculer-apollo-server')

module.exports = {
  name: 'event',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'event',
    define: {
      name: Sequelize.STRING,
      date: Sequelize.DATEONLY
    }
  },
  settings: {
    graphql: {
      type: gql`
        type Event {
          id: ID!
          name: String!
          createdAt: String!
          updatedAt: String!
          date: String!
          owner: User!
          media: [Media!]!
        }
      `,
      resolvers: {
        Event: {
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
    getEvents: {
      graphql: {
        query: gql`
          type Query {
            getEvents: [Event!]!
          }
        `
      },
      handler() {
        return []
      }
    }
  }
}
