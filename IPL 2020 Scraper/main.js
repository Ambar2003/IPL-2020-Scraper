const request = require("request");
const cheerio = require("cheerio");
const allMatcgObj = require("./alllMatch.js");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs = require("fs");
const path = require("path");
const iplPath = path.join(__dirname,"ipl");
dirCreator(iplPath);
console.log("before");
request(url, cb);
function cb(err,response,html) {
  if (err) {
    console.log(err);
  } else {
    extractLink(html);
  }
}
console.log("after");
function extractLink(html) {
  let $ = cheerio.load(html);
  let fullLink =
    "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-schedule-fixtures-and-results";
    allMatcgObj.gAlMatches(fullLink); 
}
function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
      fs.mkdirSync(filePath);
    } 
}

