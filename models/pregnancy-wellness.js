import { INTEGER, STRING, DOUBLE, TEXT, BOOLEAN } from "sequelize";
import  sequelize  from "../utils/database.js";

const PregnancyWellness =sequelize.define(
  "pregnancy-wellness",
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user: {
      type: STRING,
      allowNull: false,
    },
    overallEnergy: INTEGER,
    physicalState: INTEGER,
    mentalState: INTEGER,
    digestion: INTEGER,
    sleepQuality: INTEGER,
    timestamp : STRING
  },
  { timestamps: false }
);

export default PregnancyWellness;
