import Express from "express";
import { google } from "googleapis";
import sequelize from "./utils/database.js";
const app = Express();
import router from "./routes/heathRoute.js";
import morgan from 'morgan'
import bodyParser from 'body-parser'

export const auth = new google.auth.GoogleAuth({
  keyFile: "cred.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Create client instance for auth
export const client = await auth.getClient();

// Instance of Google Sheets API
export const googleSheets = google.sheets({ version: "v4", auth: client });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)

 const PORT = process.env.PORT ?  process.env.PORT :3000
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize
    // .sync()
    .sync({force : true});
    console.log("db Connection has been established successfully.");
    console.log("running on "+PORT);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
