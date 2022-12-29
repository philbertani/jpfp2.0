
//dummy values just to pass it to browser
const SQL = {STRING:0, TEXT: 1, FLOAT:2}
const notEmpty = 0;

export const StudentsTable = {
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
}