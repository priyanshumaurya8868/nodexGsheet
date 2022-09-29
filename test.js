import moment from "moment";
// const endOfMonth = moment().subtract(1, "months"). endOf('month'). format('MMM-DD-YY');
// //  console.log(endOfMonth)

// import { getColByDate } from "./utils/constants.js";

// const currentMoment = moment();
// const fetchTill = currentMoment.format("MMM-DD-YY");
// const [ftmonth, ftday, ftyear] = fetchTill.split("-");

// const pastMoment = moment().subtract(40, "days");
// const fetchFrom = pastMoment.format("MMM-DD-YY");
// const [ffmonth, ffday, ffyear] = fetchFrom.split("-");
// const shouldMakeTwoNetWorkCalls = ftmonth !== ffmonth;

// console.log("past days" + 40);
// const diff = pastMoment.diff(currentMoment, "months", true);
// console.log("Difference : " + diff);

const numOfDay = 10;

const currentMoment = moment("09-7-2022", "MM-DD-YYYY");
const pastMoment = moment("08-29-22", "MM-DD-YY");
const pastMoment2 = pastMoment.clone();


// const r = pastMoment2.diff(currentMoment, "month", true);
// print(r);
const list = [];

// do {
//    list.push(pastMoment2.format("MMMYY")+"!A:"+pastMoment2.endOf("month").format("DD") );
 
   // pastMoment2.add(1, "month");
//  }while (pastMoment2.diff(currentMoment, "months", true) <0)
 

 print(pastMoment2.diff(currentMoment, "months", true) );
//  pastMoment2.add(4,'days', true)
 print(pastMoment2.diff(currentMoment, "months", true)  );


const x = pastMoment2.diff(currentMoment, "months", true) 
print(x <0 );

//if( pmothnname !== cmonthname)
while(pastMoment2.diff(currentMoment, "months", true)<0 && pastMoment.format('MMM') !== currentMoment.format('MMM')){
print("-ve")
list.push(pastMoment2.format("MMMYY")+"!A:"+pastMoment2.endOf("month").format("DD") );
 
pastMoment2.add(1, 'months')
}


print(pastMoment2.diff(currentMoment, "months", true) <1 );


print(list)
function print(t) {
  console.log(t);
}
// print(currentMoment.diff(pastMoment2, "months", true)  )
// pastMoment2.add(1, 'month', true)
// print(currentMoment.diff(pastMoment2, "months", true))
// pastMoment2.add(1, 'month', true)
// print(currentMoment.diff(pastMoment2, "months", true) )

// print("**************")



// print(pastMoment2.diff(currentMoment, "months", true)  )
// pastMoment2.add(1, 'month', true)
// print(pastMoment2.diff(currentMoment, "months", true))
// pastMoment2.add(1, 'month', true)
// print(pastMoment2.diff(currentMoment, "months", true) )