import { auth, client, googleSheets } from "../app.js";
import moment from "moment";
import DailyActivity from "../models/daily-activity.js";
import PregnancyWellness from "../models/pregnancy-wellness.js";
import {
  DAILY_ACTIVITIES_CODS,
  PREGNANCY_WELLNESS_DATE_CODS,
} from "../utils/constants.js";

export const getCurrentDay = async (req, res, next) => {
  const spreadsheetId = req.query.spreadsheetId
    ? req.query.spreadsheetId
    : "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";
  try {

    //current date (by default)
    const timestamp =
      req.query.timestamp || moment().format("MMM-DD-YY").toString();
    console.log(timestamp);

    const [month, day, year] = timestamp.split("-");

    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${month} '${year}!${DAILY_ACTIVITIES_CODS[day]}`,
    });

    const getPregWelRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${month} '${year}!${PREGNANCY_WELLNESS_DATE_CODS[day]}`,
    });

    const dailyActivities = [].concat.apply([], getDailyActRows.data.values);
    const pregnancyWellness = [].concat.apply([], getPregWelRows.data.values);

    res.status(200).json({
      dailyActivities,
      pregnancyWellness,
      timestamp,
      username : "tempiee"
    });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

export const sendDataToDB = async (req, res, next) => {
  const spreadsheetId =
    req.query.spreadsheetId || "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";

  try {
    //current date (by default)
    const timestamp =
      req.query.timestamp || moment().format("MMM-DD-YY").toString();
    console.log(timestamp);

    const [month, day, year] = timestamp.split("-");

    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${month} '${year}!${DAILY_ACTIVITIES_CODS[day]}`,
    });
    const getPregWelRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${month} '${year}!${PREGNANCY_WELLNESS_DATE_CODS[day]}`,
    });

    //flat..
    const dailyActResArray = [].concat.apply([], getDailyActRows.data.values);
    const pregWelResArray = [].concat.apply([], getPregWelRows.data.values);

    //store...
    const dailyActivity = await DailyActivity.create({
      username: "tempie",
      practiceYoga: dailyActResArray[0] ? "✅" === dailyActResArray[0] : null,
      dailyMeditation10Mins: dailyActResArray[0] ?"✅" === dailyActResArray[1] : null,
      talkToYourBaby: dailyActResArray[0] ?"✅" === dailyActResArray[2] : null,
      didNotEatJunkFood: dailyActResArray[0] ?"✅" === dailyActResArray[3] : null,
      timestamp: `${month}-${year}-${year}`,
    });
    const pregnancyWellness = await PregnancyWellness.create({
      username: "tempie",
      timestamp: `${month}-${year}-${year}`,
      overallEnergy: pregWelResArray[0],
      physicalState: pregWelResArray[1],
      mentalState: pregWelResArray[2],
      digestion: pregWelResArray[3],
      sleepQuality: pregWelResArray[4],
    });

    //send res
    res.status(201).json({
      msg: "data stored",
      dailyActivity,
      pregnancyWellness,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

export const temp = async(req,res,next)=>{
  
 res.status(200).json({msg : "welcome!"})

}