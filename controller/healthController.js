import { auth, googleSheets } from "../app.js";
import { getColByDate } from "../utils/constants.js";
import moment from "moment";
import Participant from "../models/participant.js";
import { Op } from "sequelize";
import * as helper from "../helpers/sync-helpers.js";
import Domain from "../models/domain.js";
import Activity from "../models/activity.js";
const DAILY_ACTIVITIES = "DAILY ACTIVITIES";
const PREGNANCY_WELLNESS = "PREGNANCY WELLNESS";

export const displayData = async (req, res, next) => {
  const ranges = ["Sep22!A:C", "Aug22!A:C"];
  // req.body.ranges ? req.body.ranges : [];

  // const pid = req.query.pId || "Shreya";

  const spreadsheetId = req.query.spreadsheetId
    ? req.query.spreadsheetId
    : "1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0";

  const numOfDay = +(req.query.days || 10);

  if (numOfDay > 10) {
    numOfDay = numOfDay % 10;
  }

  if (ranges.length === 0) {
    getRange(numOfDay).map((range) => ranges.push(range));
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

    if (!participant) {
      res.status(404).json({ message: "User not exists" });
    }

    // Read rows from spreadsheet
    const getDailyActRows = await googleSheets.spreadsheets.values.batchGet({
      auth,
      spreadsheetId,
      ranges: [...ranges],
      majorDimension: "COLUMNS",
    });

    const sheets = getDailyActRows.data.valueRanges.map((valueRange) =>
      fetchData(valueRange)
    );
    const pw = [];
    const da = [];

    sheets.map((sheet) => {
      sheet.pw_results.map((datedCol) => {
        datedCol.map((actOnthatDate) => {
          pw.push(actOnthatDate);
        });
      });
      sheet.da_results.map((datedCol) => {
        datedCol.map((actOnthatDate) => {
          da.push(actOnthatDate);
        });
      });
    });

    const savedActs_da = await Promise.all(
      da.map((act) =>
        Activity.create({
          title: act.title,
          value: act.value ? (act.value === "✅" ? 1 : 0) : null,
          date: act.date,
        })
      )
    );

    const savedActs_pw = await Promise.all(
      pw.map((act) =>
        Activity.create({
          title: act.title,
          value: act.value ? act.value : null,
          date: act.date,
        })
      )
    );
    const [da_domain, pw_domain] = participant.domains;

    const res1 = await da_domain.addActivities(savedActs_da)
    const res2 = await pw_domain.addActivities(savedActs_pw)

    res.status(200).json({ msg: "done", res1 , res2});
  } catch (err) {
    res.status(500).json({ msg: err.message || "Something went wrong!" });
  }
};

function upsertActivity(values, condition, domain) {
  return Activity
      .findOne({ where: condition })
      .then(function(obj) {
          // update
          if(obj)
              return obj.update(values);
          // insert
          return Activity.create(values);
      })
      .then(act => {
        return domain.addActivity(act)
      })
}

export const temp = async (req, res, next) => {
  const result = await Participant.findAll({ include: Domain, require: true });

  res.send(result);
};

export const regUserRec = async (req, res, next) => {
  const spreadsheetId =
    req.query.spreadsheetId || "1yxMYxYoUOaYiecS4279a6Gvcuzx8trSfHf-LaIcnLXo";
  const range = req.query.range || "Sheet1!A:B";
  const rows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: range,
  });

  const participants = [];
  const records = rows.data.values;
  for (let i = 1; i < records.length; i++) {
    const [name, journalLink] = records[i];

    const p = await Participant.create({
      spreadsheetId: helper.getspreadSheetId(journalLink),
      name: name,
    });
    const da = await Domain.create({ label: DAILY_ACTIVITIES });
    const pw = await Domain.create({ label: PREGNANCY_WELLNESS });
    await p.addDomains([da, pw]);
    participants.push(p);
  }
  res.status(201).json({ participants });
};

export const regDomains = async (req, res, next) => {
  try {
    const list = req.body.list
      ? req.body.list
      : [DAILY_ACTIVITIES, PREGNANCY_WELLNESS];
    const result = [
      await Domain.create({ label: DAILY_ACTIVITIES }),
      await Domain.create({ label: PREGNANCY_WELLNESS }),
    ];
    const c = await Domain.count();
    console.log(c);
    res.status(201).json({ result, c });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const fetchData = (item) => {
  const monthYear = item.range.split("!")[0];
  console.log(monthYear);
  const _values = item.values;
  // return _values
  const da_labeIndex = _values[0].findIndex(
    (value) => value === DAILY_ACTIVITIES
  );
  const pw_labelIndex = _values[0].findIndex(
    (value) => value === PREGNANCY_WELLNESS
  );

  console.log("lable Index " + pw_labelIndex);

  const da_dateIndexes = da_labeIndex + 1;
  const pw_dateIndexes = pw_labelIndex + 1;

  console.log("date Index " + pw_dateIndexes);

  const da_startColIndex = da_dateIndexes + 1;
  const pw_startColIndex = pw_dateIndexes + 1;

  console.log("start Index " + pw_startColIndex);

  const da_endColIndex = pw_labelIndex - 3;
  const pw_endColIndex = _values[0].length - 1;

  console.log("end Index " + pw_endColIndex);

  //extrating props
  const da_props = []; //[day, propName1, propName2, propName3,...]
  da_props.push("day");
  for (let i = da_startColIndex; i <= da_endColIndex; i++) {
    da_props.push(_values[0][i]);
  }

  const pw_props = []; //[day, propName1, propName2, propName3,...]
  pw_props.push("day");
  for (let i = pw_startColIndex; i <= pw_endColIndex; i++) {
    pw_props.push(_values[0][i]);
  }

  const da_resultArr = []; //[dayValue, propValue1, propValue2, propValue3... ]
  for (let i = 1; i < _values.length; i++) {
    const _dailyRec = [];
    for (let j = da_dateIndexes; j <= da_endColIndex; j++) {
      _dailyRec.push(_values[i][j]);
    }
    da_resultArr.push(_dailyRec);
  }

  const pw_resultArr = []; //[dayValue, propValue1, propValue2, propValue3... ]
  for (let i = 1; i < _values.length; i++) {
    const _dailyRec = [];
    for (let j = pw_dateIndexes; j <= pw_endColIndex; j++) {
      _dailyRec.push(_values[i][j]);
    }
    pw_resultArr.push(_dailyRec);
  }
  // [ {title : "", value : "", date : ""} ]
  const pw_results = pw_resultArr.map((dailyRec) => {
    console.log(dailyRec);
    let propA = [];
    for (let i = 1; i < dailyRec.length; i++) {
      const prop = {
        title: pw_props[i],
        value: dailyRec[i],
        date: dailyRec[0] + "-" + monthYear.split("'").join("-"),
      };
      propA.push(prop);
    }
    return propA;
  });

  // [ {title : "", value : "", date : ""} ]
  const da_results = da_resultArr.map((dailyRec) => {
    console.log(dailyRec);
    let propA = [];
    for (let i = 1; i < dailyRec.length; i++) {
      const prop = {
        title: da_props[i],
        value: dailyRec[i],
        date: dailyRec[0] + "-" + monthYear.split("'").join(""),
      };
      propA.push(prop);
    }
    return propA;
  });

  return {
    pw_results,
    da_results,
  };
};

function getRange(numOfDay) {
  const ranges = [];
  const fetchTill = moment().format("MMM-DD-YY");
  const [ftmonth, ftday, ftyear] = fetchTill.split("-");

  const pastMoment = moment().subtract(numOfDay, "days");
  const fetchFrom = pastMoment.format("MMM-DD-YY");
  const [ffmonth, ffday, ffyear] = fetchFrom.split("-");
  const shouldMakeTwoNetWorkCalls = ftday < 10 && ftmonth !== ffmonth;

  if (shouldMakeTwoNetWorkCalls) {
    ranges.push(
      ffmonth +
        ffyear +
        `!A:${getColByDate[+pastMoment.endOf("month").format("DD")]})`
    );
  }
  ranges.push(ftmonth + ftyear + `!A:${getColByDate[+ftday]}`);
  return ranges;
}

// const getDateForDB = (oldDay)=>{
//   const [month, day, year]  = moment().format('MMM-DD-YY').split("-")
//   if(+oldDay > day ){
//     const [old] moment().subtract(1, 'months').format('MMM-YY').split("-")
//     return oldDay +
//   }
// }
