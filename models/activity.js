import { INTEGER, STRING } from "sequelize";
import sequelize from "../utils/database.js";

const Activity = sequelize.define("activity", {

  title: {
    type: STRING,
    allowNull: false,
  },
  value : INTEGER,
  day : {
    type: STRING,
    allowNull: false,
  },
  monthYear : STRING,
});

export default Activity;
