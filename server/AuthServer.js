import argon2 from 'argon2'
import randomBytes from 'randombytes'
import jwt from 'jsonwebtoken'
import { prisma } from './generated/prisma-client'

export default class AuthService {
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
  }

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
      user: {
        email: userRecord.email,
        name: userRecord.name
      },
      token: this.generateJWT(userRecord)
    }
  }

  generateToken(user) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email
    }
    const signature = 'MySuP3R_z3kr3t'
    const expiration = '6h'

    return jwt.sign({ data }, signature, { expiresIn: expiration })
  }
}
