import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.db_username,
  process.env.db_password,
  {
    dialect: "postgres",
    logging: false,
    host: process.env.db_host,
    port: process.env.db_port,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;

// import Sequelize from "sequelize";

// const sequelize = new Sequelize(
//   "postgres",
//   "postgres",
//   "123456",
//   {
//     dialect: "postgres",
//     host: "localhost",
//     port: "5432",
//     logging: false
//   }
// );

// export default sequelize
