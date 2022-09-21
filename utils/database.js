import Sequelize from "sequelize";

const sequelize = new Sequelize('test_db','root','123456',{
    dialect : 'mysql',
    host : 'localhost'
});

export default sequelize;
