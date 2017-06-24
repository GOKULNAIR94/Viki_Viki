module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;
  var speech;
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
          jsonQuery('[* '+ query +']'+'['+ attrib +']', {
            data: content
          }).value;
  console.log("output :" + output);
  if( output.length == 0 ){
    speech = "No records found.";
  }
  else
   speech = output;
  return res.json({
    speech: speech,
    displayText: speech,
    //source: 'webhook-OSC-oppty'
  })

}