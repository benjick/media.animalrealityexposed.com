const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const proxy = require('http-proxy-middleware')
const config = require('../nuxt.config.js')

const app = express()

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  app.use(express.json())

  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Proxy requests to Moleculer backend
  const backend = proxy({ target: 'http://localhost:3001', changeOrigin: true })
  app.use('/api', backend)
  app.use('/graphql', backend)

  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}.`,
    badge: true
  })
}
start()
