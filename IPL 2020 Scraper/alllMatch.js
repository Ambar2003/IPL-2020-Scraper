const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");
function getAllMatchesLink(url){
    request(url,function(err,response,html){
        if(err){
          console.log(err);
        }else{
          extractAllLinks(html);
        }
    })
}
function extractAllLinks(html){
  let $ = cheerio.load(html);
  let scoreCardElems = $(".ds-flex.ds-space-x-5 a.ds-no-tap-higlight");
  for(let i = 0;i<scoreCardElems.length;i+=6){
    let link = $(scoreCardElems[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    console.log(fullLink);
    scoreCardObj.ps(fullLink);
  }
}
module.exports = {
    gAlMatches:getAllMatchesLink
}