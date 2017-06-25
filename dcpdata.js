module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;
  var speech;
  
  var Name = req.body.result.contexts[0].parameters['Name.original'];
  var attrib = req.body.result.parameters['DCP_AttribsGeneral'];

  var filePath = "./data/EmployeeData.json";
  content = fs.readFileSync( filePath, 'utf8' );
  console.log("Content : " + content);
  content = JSON.parse(content);

  console.log("Content :" + JSON.stringify(content));
  
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
  else{
    if( output.length == 1 ){
      speech = output[0];
    }
  }
   
  
  return res.json({
    speech: speech,
    displayText: speech,
    //source: 'webhook-OSC-oppty'
  })

}