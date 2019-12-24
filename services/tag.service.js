const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')

module.exports = {
  name: 'tag',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'tag',
    define: {
      name: Sequelize.STRING
    }
  }
}
