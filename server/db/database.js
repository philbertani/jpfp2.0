// The sole purpose of this module is to establish a connection to your
// Postgres database by creating a Sequelize instance (called `db`).
// You shouldn't need to make any modifications here.

const SQL = require('sequelize')  //Sequelize will be SQL from here on
const pkg = require('../../package.json')

//changed package name=>pkg.name to 'jpfp' because it sounds cooler
//console.log('package json is:',pkg);

const db = new SQL(`postgres://localhost:5432/${pkg.name}`, {
  logging: false,
})

module.exports = db