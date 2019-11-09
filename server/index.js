const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')
const AuthService = require('./AuthService')
const server = require('./apollo')

server.applyMiddleware({ app })

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  app.use(express.json())

  app.get('/api/adduser', async function(req, res) {
    const result = await AuthService.SignUp('max@malm.me', 'test', 'Max Malm')
    res.json(result)
  })

  app.post('/api/auth/login', async function(req, res) {
    const { username, password } = req.body
    try {
      const result = await AuthService.Login(username, password)
      res.json(result)
    } catch (error) {
      res.status(400).send('Could not login')
    }
  })

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
    message: `Server listening on http://${host}:${port}. GraphQL: http://${host}:${port}${server.graphqlPath}`,
    badge: true
  })
}
start()
