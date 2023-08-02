const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");
function processScoreCard(url){
  request(url,cb);
}

function cb(err,response,html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetails(html);
  }
}
count = 0; 
function extractMatchDetails(html){
    let $ = cheerio.load(html);
    let innings = $(".ds-text-title-xs.ds-font-bold.ds-capitalize");
    // console.log(teamName);
    // console.log(opponentName);
    count++;
    for(let i = 0;i<innings.length;i++){
      console.log("--------------------");
      console.log(`match ${count}`);
      let dateAndVenue = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
      StringArr = dateAndVenue.text().split(",");
      venue = StringArr[1].trim();
      date1 = StringArr[2].trim();
      date2 = StringArr[3].trim();
      let Date = date1 + "," + date2;
      console.log("Bastmen's Statisitcs")
      console.log("                       ");
      console.log("Venue->",venue);
      console.log("Date->",Date);
      let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo").text();
      console.log(result);
      let k = 0;
      let allRows = $(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tr");
      for(let j = 0;j<allRows.length;j++){
        let allCols = $(allRows[j]).find("td");
        if(allCols.hasClass("ds-hidden")){
          playerName = $(allCols[0]).text();
          let runScored = $(allCols[2]).text();
          let ballsDelivered = $(allCols[3]).text();
          let foursScored = $(allCols[5]).text();
          let sixesScored = $(allCols[6]).text();
          let strikeRate = $(allCols[7]).text();
          console.log(`${playerName} ${runScored} ${ballsDelivered} ${foursScored} ${sixesScored} ${strikeRate}`);
          processPlayer(playerName,runScored,ballsDelivered,foursScored,sixesScored,strikeRate,venue,Date,result);
        }
      }
      break;
    }
  }
  function processPlayer(playerName,runScored,ballsDelivered,foursScored,sixesScored,strikeRate,venue,Date,result){
      let teamPath = path.join(__dirname,"ipl");
      dirCreator(teamPath);
      let filePath = path.join(teamPath,playerName + ".xlsx");
       let content = excelReader(filePath,playerName);
      let playerObj = {
        playerName,
        runScored,ballsDelivered,foursScored,
        sixesScored,
        strikeRate,
        venue,
        Date,
        result
      }
      content.push(playerObj);
      execelWriter(filePath,content,playerName);
  }

  function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
      fs.mkdirSync(filePath);
    }
  }
  function execelWriter(filePath,json,sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);
}
function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath) == false){
        return[];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
module.exports = {
  ps:processScoreCard
}