const { ApolloService } = require('moleculer-apollo-server')
const ApiService = require('moleculer-web')

const api = {
  mixins: [
    ApiService,
    ApolloService({
      typeDefs: ``,
      resolvers: {},
      routeOptions: {
        path: '/graphql',
        cors: true,
        mappingPolicy: 'restrict'
      },
      serverOptions: {
        tracing: true
      }
    })
  ],
  settings: {
    server: false,
    port: 3000,
    whitelist: ['**'],
    routes: [{ mappingPolicy: 'all' }]
  }
}

module.exports = api
