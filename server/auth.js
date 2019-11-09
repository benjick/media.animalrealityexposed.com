const express = require('express')
const AuthService = require('./AuthService')
const auth = express.Router()

auth.get('/adduser', async function(req, res) {
  try {
    const result = await AuthService.SignUp('max@malm.me', 'test', 'Max Malm')
    res.json(result)
  } catch (error) {
    res.status(400).send('Could not create user')
  }
})

auth.post('/login', async function(req, res) {
  const { username, password } = req.body
  try {
    const result = await AuthService.Login(username, password)
    res.json(result)
  } catch (error) {
    res.status(400).send('Could not login')
  }
})

module.exports = auth
