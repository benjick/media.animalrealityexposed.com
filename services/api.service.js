const { ApolloService } = require('moleculer-apollo-server')
const ApiService = require('moleculer-web')

const api = {
  name: 'api',
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
    port: 3001,
    whitelist: ['**'],
    routes: [
      // Don't forget to add proxies in server/index.js
      { path: '/api', mappingPolicy: 'all' },
      {
        path: '/api/upload/s3',
        bodyParsers: {
          json: false,
          urlencoded: false
        },
        aliases: {
          'POST /': 'multipart:file.save'
        },
        busboyConfig: {
          limits: {
            files: 1
          }
        },
        mappingPolicy: 'restrict'
      }
    ],
    cors: {
      origin: '*'
    }
  }
}

module.exports = api
