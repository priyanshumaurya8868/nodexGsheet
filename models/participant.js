import { STRING } from "sequelize";
import sequelize from "../utils/database.js";

const Participant = sequelize.define("participant", {
  // id: {
  //   type: INTEGER,
  //   autoIncrement: true,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  spreadsheetId: {
    type: STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
});

export default Participant;
