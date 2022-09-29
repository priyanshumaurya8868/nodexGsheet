import { auth, googleSheets } from "../app.js";
import moment from "moment";
import Participant from "../models/participant.js";
import { Op } from "sequelize";
import * as helper from "../helpers/sync-helpers.js";
import Domain from "../models/domain.js";
import Activity from "../models/activity.js";
const DAILY_ACTIVITIES = "DAILY ACTIVITIES";
const PREGNANCY_WELLNESS = "PREGNANCY WELLNESS";
import axios from "axios";

export const storeDatabySpreadsheetId = async (req, res, next) => {
  const ranges =
    //  ["Sep22!A:B"];
    req.body.ranges ? req.body.ranges : [];

  const spreadsheetId = req.query.spreadsheetId;
  // ? req.query.spreadsheetId
  // : "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";

  if (!spreadsheetId) {
    res.status(400).json({ msg: "SpreadsheetId is missing!" });
  }

  const numOfDay = +(req.query.days || 10);

  const currentMoment = moment();
  const pastMoment = moment().subtract(numOfDay, "days");
  const fetchFrom = pastMoment.format("MMM-DD-YY");
  const [ffmonth, ffday, ffyear] = fetchFrom.split("-");

  if (ranges.length === 0) {
    helper
      .getRange(numOfDay, currentMoment, pastMoment)
      .map((range) => ranges.push(range));
  }

  try {
    const participant = await Participant.findOne({
      where: {
        spreadsheetId: {
          [Op.eq]: spreadsheetId,
        },
      },
      include: {
        model: Domain,
      },
    });

    //...validation
    if (!participant) {
      return res.status(404).json({
        message: "No User exists with spreadsheetId : " + spreadsheetId,
      });
    }

    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: [...ranges],
      majorDimension: "COLUMNS",
    });

    //...parsing data
    const sheets = getDailyActRows.data.valueRanges.map((valueRange) =>
      helper.fetchData(valueRange)
    );
    const pw = [];
    const da = [];

    //removing unnessary days
    sheets.map((sheet) => {
      
      sheet.pw_results.map((datedCol) => {
        const datedScore =
          +helper.monthYearParser(datedCol[0].monthYear) + +datedCol[0].day;
        const ffScore = +helper.monthYearParser(ffmonth + ffyear) + +ffday;
        if (datedScore >= ffScore) {
          datedCol.map((actOnthatDate) => {
            pw.push(actOnthatDate);
          });
        }
      });
      sheet.da_results.map((datedCol) => {
        const datedScore =
          +helper.monthYearParser(datedCol[0].monthYear) + +datedCol[0].day;
        const ffScore = +helper.monthYearParser(ffmonth + ffyear) + +ffday;
        if (datedScore >= ffScore) {
          datedCol.map((actOnthatDate) => {
            da.push(actOnthatDate);
          });
        }
      });
    });

    const [da_domain, pw_domain] = participant.domains;

    const res1 = await Promise.all(
      da.map((dailyAct) => {
        return upsertActivity(
          {
            title: dailyAct.title,
            value: dailyAct.value ? (dailyAct.value === "✅" ? 1 : 0) : null,
            day: dailyAct.day,
            monthYear: dailyAct.monthYear,
          },
          {
            domainId: da_domain.id,
            day: dailyAct.day,
            title: dailyAct.title,
            monthYear: dailyAct.monthYear,
          },
          da_domain
        );
      })
    );

    const res2 = await Promise.all(
      pw.map((PregWell) => {
        return upsertActivity(
          {
            title: PregWell.title,
            value: PregWell.value ? PregWell.value : null,
            day: PregWell.day,
            monthYear: PregWell.monthYear,
          },
          {
            domainId: pw_domain.id,
            day: PregWell.day,
            title: PregWell.title,
            monthYear: PregWell.monthYear,
          },
          pw_domain
        );
      })
    );

    return res.status(200).json({ msg: "done", participant });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

export const regUserRec = async (req, res, next) => {
  const spreadsheetId =
    req.query.spreadsheetId || "1K_aFiK0cZhKQUnVMMF5x03JWNjWADfauxjT-JoI_e8c";
  // "1yxMYxYoUOaYiecS4279a6Gvcuzx8trSfHf-LaIcnLXo";

  const range = req.query.range || "Journal Automation!A:B";

  try {
    const rows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: range,
    });

    const participants = [];
    const records = rows.data.values;
    for (let i = 1; i < records.length; i++) {
      try {
        const [name, journalLink] = records[i];

        const p = await Participant.create({
          spreadsheetId: helper.getspreadSheetId(journalLink),
          name: name,
        });
        const da = await Domain.create({ label: DAILY_ACTIVITIES });
        const pw = await Domain.create({ label: PREGNANCY_WELLNESS });
        await p.addDomains([da, pw]);
        participants.push(p);
      } catch (err) {
        console.log(err.message);
      }
    }
    return res.status(201).json({ newRegisteredUSers: participants });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const upsertActivity = async (values, condition, domain) => {
  const obj = await Activity.findOne({ where: condition });
  // update
  if (obj) {
    return await obj.update(values);
  }

  return await domain.addActivity(await Activity.create(values));
};

export const sync = async (req, res, next) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  try {
    const participants = await Participant.findAll({});

    const data = participants.map((p) => {
      return { spreadsheetId: p.spreadsheetId, name: p.name, lastHowManyDays : 10 };
    });

    const result = await Promise.all(
      data.map( async (obj) => {
        try {
           await axios.post(
            baseUrl +
              `?spreadsheetId=${obj.spreadsheetId}&days=${obj.lastHowManyDays}&user=${obj.name}`,
            {
              method: "POST",
            }
          );
          
          return { user: obj, msg: "Data stored!!" };
        } catch (err) {
          // console.log(err)
          return { user: obj, msg:err.message ||"Could not sync data!!" };
        }
      })
    );
    res.status(201).json({ msg: "done!", result });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
