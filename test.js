
import moment from "moment";
// const endOfMonth = moment().subtract(1, "months"). endOf('month'). format('MMM-DD-YY');
// //  console.log(endOfMonth)

// import { getColByDate } from "./utils/constants.js";


const currentMoment = moment();
const fetchTill = currentMoment.format("MMM-DD-YY");
const [ftmonth, ftday, ftyear] = fetchTill.split("-");

const pastMoment = moment().subtract(40, "days");
const fetchFrom = pastMoment.format("MMM-DD-YY");
const [ffmonth, ffday, ffyear] = fetchFrom.split("-");
const shouldMakeTwoNetWorkCalls = ftmonth !== ffmonth;

console.log("past days" + 40);
const diff = pastMoment.diff(currentMoment, "months", true);
console.log("Difference : " + diff);