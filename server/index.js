const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // app.post('/api/auth/login', function(req, res) {
  //   console.log(req.body)
  //   res.send('Birds home page')
  // })

  // app.get('/api/auth/logout', function(req, res) {
  //   res.send('Logout')
  // })

  // app.get('/user', function(req, res) {
  //   res.send('Birds home page')
  // })
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
