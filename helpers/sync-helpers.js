import moment from "moment";

export function getRangers(dayNum, coordSet) {
  const ranges = [];
  for (let i = 0; i <= +dayNum; i++) {
    const date = moment().subtract(i, "days").format("MMM-DD-YY");
    const range = dateToRange(date, coordSet);
    ranges.push(range);
  }
  return ranges;
}

function dateToRange(date, coordSet) {
  const [month, day, year] = date.split("-");
  const index = coordSet[day];
  const range = `${month} '${year}!${index}`;
  return range;
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function rangeToDate(range, day) {
  const arr = range.split("'");
  const obj = { month: arr[1].trim(), year: arr[3] };
  if (day) {
    return `${day}-${obj.month}-${obj.year}`;
  }
  return `${obj.month}-${obj.year}`;
}


export const pregWellMapper = (list, user)=>
  list.map((valueRange) => {
    const values = valueRange.values;
    const day = values[0];
    const range = valueRange.range;
    const timestamp = rangeToDate(range, day);
    const obj = {
      user : user,
      timestamp: timestamp,
      overallEnergy: values[1] ? values[1][0] : null,
      physicalState: values[2] ? values[2][0]  : null,
      mentalState: values[3] ? values[3][0] : null,
      digestion: values[4] ? values[4][0]  : null,
      sleepQuality:values[5] ? values[5][0]  : null,
    };
    return obj;
  })


export const dailyActMapper = (list , user)=>
  list.map((valueRange) => {
    const values = valueRange.values;
    const day = values[0];
    const range = valueRange.range;
    const timestamp = rangeToDate(range, day);
    const obj = {
      user : user,
      timestamp: timestamp,
      practiceYoga: values[1] ? values[1][0] === "✅" : null,
      dailyMeditation10Mins: values[2] ? values[2][0] === "✅" : null,
      talkToYourBaby: values[3] ? values[3][0] === "✅" : null,
      didNotEatJunkFood: values[4] ? values[4][0] === "✅" : null,
    };
    return obj;
  })

