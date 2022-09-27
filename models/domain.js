import { INTEGER, STRING, BOOLEAN } from "sequelize";
import sequelize from "../utils/database.js";

const Domain = sequelize.define("domain", {
  
  label: {
    type: STRING,
    allowNull: false,
  },


});

export default Domain;
