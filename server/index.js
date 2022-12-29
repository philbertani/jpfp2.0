const port = process.env.PORT || 3000;
const app = require('./app');
const { db } = require('./db')

const startDB = async () => {
    const dbSync = await db.sync();
    //dbSync is the whole Sequelize object
}
startDB();

app.listen(port, ()=> console.log(`listening on port ${port}`));
