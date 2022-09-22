import { auth, googleSheets } from "../app.js";
import DailyActivity from "../models/daily-activity.js";
import PregnancyWellness from "../models/pregnancy-wellness.js";
import axios from 'axios'
import {
  getRangers,
  dailyActMapper,
  pregWellMapper,
  getspreadSheetId,
} from "../helpers/sync-helpers.js";
import { getDataCoord } from "../utils/constants.js";

export const displayData = async (req, res, next) => {
  const user = req.query.user || "Shreya";
  const numOfDay = req.query.days || 10;
  const spreadsheetId = req.query.spreadsheetId
    ? req.query.spreadsheetId
    : "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";
  try {
    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: getRangers(numOfDay, getDataCoord(5, 10)),
    });

    const getPregWellRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: getRangers(numOfDay, getDataCoord(13, 19)),
    });

    const DailyActivities = dailyActMapper(
      getDailyActRows.data.valueRanges,
      user
    );

    const PregnancyWellness = pregWellMapper(
      getPregWellRows.data.valueRanges,
      user
    );

    res.status(200).json({ DailyActivities, PregnancyWellness });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

export const storeData = async (req, res, next) => {
  const user = req.query.user || "Shreya";
  const numOfDay = req.query.days || 10;
  const spreadsheetId = req.query.spreadsheetId
    ? req.query.spreadsheetId
    : "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";
  try {
    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: getRangers(numOfDay, getDataCoord(5, 10)),
    });

    const getPregWellRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: getRangers(numOfDay, getDataCoord(13, 19)),
    });

    const dailyActivitiesData = dailyActMapper(
      getDailyActRows.data.valueRanges,
      user
    );

    const pregnancyWellnessData = pregWellMapper(
      getPregWellRows.data.valueRanges,
      user
    );

    dailyActivitiesData.map(async (item) => await DailyActivity.create(item));

    pregnancyWellnessData.map(
      async (item) => await PregnancyWellness.create(item)
    );

    res.status(201).json({ message: "data stored!!" });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

export const sync = async (req, res, next) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const sheetname = req.query.sheetname || "Sheet1";
  const days = req.query.days || 10;
  const spreadsheetId = req.query.spreadsheetId
    ? req.query.spreadsheetId
    : "1yxMYxYoUOaYiecS4279a6Gvcuzx8trSfHf-LaIcnLXo";
  try {
    // Read rows from spreadsheet
    const Rows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetname}!A:B`,
    });

    Rows.data.values.map(async (value) => {
      const user = value[0];
      const spreadsheetId = getspreadSheetId(value[1]);
      if (spreadsheetId) {
        // /store?days=10&spreadsheetId=fdg324r2323r3323r&user=shreya#1231
        await axios.get(
          `${baseUrl}/store?${days}&spreadsheetId=${spreadsheetId}&user=${user}`
        );
      }
    });

    res.json({ msg: " done" });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};
