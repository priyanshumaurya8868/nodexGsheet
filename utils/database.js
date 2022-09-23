import Sequelize from "sequelize";

const sequelize = new Sequelize(
  "defaultdb",
  "doadmin",
  "AVNS_6ZycoIYhGzFrgZwjjAD",
  {
    dialect: "postgres",
    host: "db-postgresql-blr1-11888-do-user-9887934-0.b.db.ondigitalocean.com",
    port: "25060",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
