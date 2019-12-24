const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')
const argon2 = require('argon2')
const randomBytes = require('randombytes')
const jwt = require('jsonwebtoken')
const { moleculerGql: gql } = require('moleculer-apollo-server')

const signature = 'MySuP3R_z3kr3t'

function generateToken(user) {
  const data = {
    _id: user.id,
    name: user.name,
    email: user.email
  }
  const expiration = '7d'

  return jwt.sign({ data }, signature, { expiresIn: expiration })
}
module.exports = {
  name: 'user',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:', {
    logging: false
  }),
  settings: {
    graphql: {
      type: gql`
        type UserLogin {
          id: ID!
          email: String!
          token: String!
          name: String!
        }
        """
        This type describes a product entity.
        """
        type User {
          id: ID!
          email: String!
          name: String!
        }
      `
      // resolvers: {
      //   Product: {
      //     categories: {
      //       action: 'categories.get',
      //       rootParams: {
      //         categories: 'id'
      //       }
      //     }
      //   }
      // }
    }
  },
  model: {
    name: 'user',
    define: {
      email: {
        // needs to be unique
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: Sequelize.STRING,
      password: Sequelize.INTEGER,
      salt: Sequelize.STRING
    }
  },
  actions: {
    signup: {
      graphql: {
        query: gql`
          type Query {
            authenticateUser(username: String!, password: String!): UserLogin!
          }
        `
      },
      params: {
        email: 'string',
        password: 'string',
        name: 'string'
      },
      async handler(ctx) {
        const { email, password, name } = ctx.params
        const salt = randomBytes(32)
        const passwordHashed = await argon2.hash(password, { salt })

        const userRecord = await ctx.call('user.create', {
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
    },
    login: {
      params: {
        email: 'string',
        password: 'string'
      },
      async handler(ctx) {
        const { email, password } = ctx.params
        const userRecord = await ctx.call('user.find', { email })
        if (!userRecord || !userRecord[0]) {
          throw new Error('User not found')
        } else {
          const correctPassword = await argon2.verify(
            userRecord[0].password,
            password
          )
          console.log('correctPassword', correctPassword)
          if (!correctPassword) {
            throw new Error('Incorrect password')
          }
        }

        return {
          id: userRecord[0].id,
          email: userRecord[0].email,
          name: userRecord[0].name,
          token: generateToken(userRecord[0])
        }
      }
    }
  },
  async afterConnected() {
    await this.adapter.clear()
    setTimeout(() => {
      this.actions.signup({
        email: 'max@malm.me',
        password: 'testpassword',
        name: 'Max Malm'
      })
    }, 2000)
  }
}
