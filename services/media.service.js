const DbService = require('moleculer-db')
const SqlAdapter = require('moleculer-db-adapter-sequelize')
const Sequelize = require('sequelize')

module.exports = {
  name: 'media',
  mixins: [DbService],
  adapter: new SqlAdapter('sqlite://:memory:'),
  model: {
    name: 'media',
    define: {
      type: Sequelize.ENUM('image'),
      date: Sequelize.DATEONLY,
      original: Sequelize.STRING,
      resized: Sequelize.STRING,
      thumbnail: Sequelize.STRING
    }
  }
}
