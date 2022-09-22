
import moment from "moment";

console.log(moment().format('MMM-DD-YY'))

console.log(moment().subtract(10, 'days').format('MMM-DD-YY'))

const t =  "34234"
// "https://docs.google.com/spreadsheets/d/1TPD94tGsQRblionmHjlLAuZd5O4s6_ctiOBB0eS6Gd0/edit#gid=0"
console.log (t.split("/d/")[1].split('/edit')[0] ) 

