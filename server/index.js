const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
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

  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}.`,
    badge: true
  })
}
start()
