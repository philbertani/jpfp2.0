const SQL = require('sequelize')
const db = require('../database')

const notEmpty = { notEmpty: true }

const Students = db.define('students',{
    firstName: {
        type: SQL.STRING,
        allowNull: false,
        validate: notEmpty
    },
    lastName: {
        type: SQL.STRING,
        allowNull: false,
        validate: notEmpty
    },
    email: {
        type: SQL.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    imageUrl: {
        type: SQL.STRING,
        defaultValue: 'genericStudent.jpg'  //will find it in public
    },
    gpa: {
        type: SQL.FLOAT,
        validate: {
            isNumeric:true, 
            max: 4.0, min: 0.0
        }

    }

})

module.exports = Students