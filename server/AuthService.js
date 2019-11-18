const argon2 = require('argon2')
const randomBytes = require('randombytes')
const jwt = require('jsonwebtoken')
const { prisma } = require('../generated/prisma')

function generateToken(user) {
  const data = {
    _id: user.id,
    name: user.name,
    email: user.email
  }
  const signature = 'MySuP3R_z3kr3t'
  const expiration = '6h'

  return jwt.sign({ data }, signature, { expiresIn: expiration })
}

module.exports = {
  async SignUp(email, password, name) {
    const salt = randomBytes(32)
    const passwordHashed = await argon2.hash(password, { salt })

    const userRecord = await prisma.createUser({
      email,
      name,
      password: passwordHashed,
      salt: salt.toString('hex')
    })

    return {
      user: {
        email: userRecord.email,
        name: userRecord.name
      }
    }
  },
  async Login(email, password) {
    const userRecord = await prisma.user({ email })
    if (!userRecord) {
      throw new Error('User not found')
    } else {
      const correctPassword = await argon2.verify(userRecord.password, password)
      if (!correctPassword) {
        throw new Error('Incorrect password')
      }
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      token: generateToken(userRecord)
    }
  }
}
