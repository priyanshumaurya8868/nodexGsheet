import { INTEGER, STRING,  BOOLEAN } from "sequelize";
import sequelize from "../utils/database.js";

const DailyActivity = sequelize.define(
  "daily-activity",
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    practiceYoga: BOOLEAN,
    dailyMeditation10Mins: BOOLEAN,
    talkToYourBaby: BOOLEAN,
    didNotEatJunkFood: BOOLEAN,
    timestamp : STRING
  },
  { timestamps: false }
);

export default DailyActivity;
