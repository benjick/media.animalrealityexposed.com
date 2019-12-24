const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')

module.exports = {
  name: 'album',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'album',
    define: {
      name: Sequelize.STRING,
      date: Sequelize.DATEONLY
    }
  }
}
