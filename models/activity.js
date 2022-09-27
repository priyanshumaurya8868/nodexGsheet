import { INTEGER, STRING } from "sequelize";
import sequelize from "../utils/database.js";

const Activity = sequelize.define("activity", {

  title: {
    type: STRING,
    allowNull: false,
  },
  value : INTEGER,
  date : {
    type: STRING,
    allowNull: false,
  },
});

export default Activity;
