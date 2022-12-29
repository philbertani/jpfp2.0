
//dummy values just to pass it to browser
const SQL = {STRING:0, TEXT: 1, FLOAT:2}
const notEmpty = 0;

export const CampusesTable = {
    name: {
        type: SQL.STRING,
        allowNull: false,
        validate: notEmpty
    },
    imageUrl: {
        type: SQL.STRING,
        defaultValue: 'genericCampus.jpg'  //will find it in public which is static
    },
    address: {
        type: SQL.STRING,
        allowNull: false,
        validate: notEmpty
    },
    description: {
        type: SQL.TEXT
    },
    xCoord: {
        type: SQL.FLOAT
    },
    yCoord: {
        type: SQL.FLOAT
    }
}