const fs = require('fs')
const path = require('path')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const { ServiceBroker } = require('moleculer')
const nanomatch = require('nanomatch')
const config = require('../nuxt.config.js')
const api = require('./api')

const app = express()
const broker = new ServiceBroker({
  logger: console
})

const serviceDir = './services'

const svc = broker.createService(api)

// Load all services
fs.readdirSync(serviceDir).forEach((filePath) => {
  nanomatch(filePath, '**.service.js').forEach((file) => {
    broker.createService(require(path.resolve(`${serviceDir}/${file}`)))
  })
})

broker.start()

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  app.use(express.json())
  app.use('/api', svc.express())

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
    message: `Server listening on http://${host}:${port}. GraphQL: http://${host}:${port}/graphql`,
    badge: true
  })
}
start()
