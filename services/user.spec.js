import { ServiceBroker } from 'moleculer'
import TestService from './user.service'

const email = 'fake@example.com'
const password = 'generic_password'

describe('Test user service', () => {
  const broker = new ServiceBroker({ logger: false })
  broker.createService(TestService)

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  describe('Test user.login action', () => {
    it('should be able to login', async () => {
      const users = await broker.call('user.find', {
        email
      })
      if (users.length === 0) {
        await broker.call('user.signup', {
          email,
          password,
          name: 'Foo Bar'
        })
      }
      // Login as max@malm.me
      const user = await broker.call('user.login', {
        email,
        password
      })
      expect(user.email).toBe(email)
    })
  })
})
