// The purpose of this module is to bring your Sequelize instance (`db`) together
// with your models, for which you'll find some blank files in this directory:

const SQL = require('sequelize')
const db = require('./database')
const models = require('./models')

models.Students.belongsTo(models.Campuses)
models.Campuses.hasMany(models.Students)

module.exports = {
  db, models
}