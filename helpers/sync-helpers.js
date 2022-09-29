import { getColByDate } from "../utils/constants.js";
import moment from "moment";
const DAILY_ACTIVITIES = "DAILY ACTIVITIES";
const PREGNANCY_WELLNESS = "PREGNANCY WELLNESS";

export const fetchData = (item) => {
  const monthYear = item.range.split("!")[0];
  const _values = item.values;
  // return _values
  const da_labeIndex = _values[0].findIndex(
    (value) => value === DAILY_ACTIVITIES
  );
  const pw_labelIndex = _values[0].findIndex(
    (value) => value === PREGNANCY_WELLNESS
  );

  // console.log("lable Index " + pw_labelIndex);

  const da_dateIndexes = da_labeIndex + 1;
  const pw_dateIndexes = pw_labelIndex + 1;

  // console.log("date Index " + pw_dateIndexes);

  const da_startColIndex = da_dateIndexes + 1;
  const pw_startColIndex = pw_dateIndexes + 1;

  // console.log("start Index " + pw_startColIndex);

  const da_endColIndex = pw_labelIndex - 3;
  const pw_endColIndex = _values[0].length - 1;

  // console.log("end Index " + pw_endColIndex);

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
    let propA = [];
    for (let i = 1; i < dailyRec.length; i++) {
      const prop = {
        title: pw_props[i],
        value: dailyRec[i],
        day: dailyRec[0],
        monthYear: monthYear.split("'").join(""),
      };
      propA.push(prop);
    }
    return propA;
  });

  // [ {title : "", value : "", date : ""} ]
  const da_results = da_resultArr.map((dailyRec) => {
    let propA = [];
    for (let i = 1; i < dailyRec.length; i++) {
      const prop = {
        title: da_props[i],
        value: dailyRec[i],
        day: dailyRec[0],
        monthYear: monthYear.split("'").join(""),
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

export function getRange(numOfDay, currentMoment, pastMoment) {

  const fetchTill = currentMoment.format("MMM-DD-YY");
  const [ftmonth, ftday, ftyear] = fetchTill.split("-");
  
  const fetchFrom = pastMoment.format("MMM-DD-YY");
  console.log("fetchTill " + fetchTill);
  console.log("ferchFrom " + fetchFrom);
  console.log("past days" + numOfDay);
  const diff = currentMoment.diff(pastMoment, "months", true);
  console.log("Difference : " + diff);

  const ranges = [];
  const pastMoment2 = pastMoment.clone();
  while (
    pastMoment2.diff(currentMoment, "months", true) < 0 &&
    pastMoment.format("MMM") !== currentMoment.format("MMM")
  ) {
    ranges.push(
      pastMoment2.format("MMMYY") +
        "!A:" +
        getColByDate[+pastMoment2.endOf("month").format("DD")]
    );
    pastMoment2.add(1, "months");
  }

  ranges.push(ftmonth + ftyear + `!A:${getColByDate[+ftday]}`);
  console.log("my ranges " + ranges);
  return ranges;
}

export function getspreadSheetId(url) {
  try {
    return url.split("/d/")[1].split("/edit")[0];
  } catch (err) {
    return null;
  }
}

export const monthYearParser = (monthYear) => {
  const month = monthYear.substring(0, monthYear.length - 2);
  const year = +monthYear.substring(monthYear.length - 2, monthYear.length);
  let res = 0;
  switch (month) {
    case "Jan":
      res = 100;
      break;
    case "Feb":
      res = 200;
      break;
    case "March":
      res = 300;
      break;
    case "April":
      res = 400;
      break;
    case "May":
      res = 500;
      break;
    case "June":
      res = 600;
      break;
    case "July":
      res = 700;
      break;
    case "Aug":
      res = 800;
      break;
    case "Sep":
      res = 900;
      break;
    case "Oct":
      res = 1000;
      break;
    case "Nov":
      res = 1100;
      break;
    case "Dec":
      res = 1200;
      break;
  }
  // console.log(month)
  // console.log('prev resc-> '+res)
  res = res + year;
  // console.log('post resc-> '+res)
  return res;
};
