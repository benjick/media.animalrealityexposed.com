const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')
const server = require('./apollo')
const auth = require('./auth')
const upload = require('./upload')

server.applyMiddleware({ app })

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  app.use(express.json())

  app.use('/api/auth', auth)
  app.use('/api/upload', upload)

  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}. GraphQL: http://${host}:${port}${server.graphqlPath}`,
    badge: true
  })
}
start()
