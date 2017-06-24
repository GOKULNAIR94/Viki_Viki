module.exports = function(req, res) {

  var fs = require('fs');

  var content;

  content = fs.readFileSync('./data/EmployeeData.json', 'utf8');
  console.log("Content : " + content);
  content = JSON.parse(content);

  console.log("Content :" + JSON.stringify(content));
}