module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;

  content = fs.readFileSync('./data/EmployeeData.json', 'utf8');
  console.log("Content : " + content);
  content = JSON.parse(content);

  console.log("Content :" + JSON.stringify(content));
  
  var Name = req.body.result.contexts[0].parameters['Name.original'];
  var attrib = req.body.result.parameters['DCP_AttribsGeneral'];
  
  var query = "Name=" + Name ;
  console.log("query :" + query);
  console.log("attrib :" + attrib);
  var output =
          jsonQuery('items[* '+ query +']'+'['+ attrib +']', {
            data: content
          }).value;
  console.log("output :" + output);
  return res.json({
    speech: output,
    displayText: output,
    //source: 'webhook-OSC-oppty'
  })

}