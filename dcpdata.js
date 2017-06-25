module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;
  var speech;
  var intentName = req.body.result.metadata.intentName;

  var Name = "";
  var attrib = "";

  var filePath = "";
  var query = "";

  if( intentName == "DCP - EmployeeData" ) 
  {
    Name = req.body.result.contexts[0].parameters['Name.original']
    attrib = req.body.result.parameters['DCP_AttribsGeneral']
    filePath = "./data/EmployeeData.json";
    query = "Name=" + Name ;
  }

  if( intentName == "DCP - HireTerm" ) 
  {
    filePath = "./data/EmployeeData.json";
    //if(  )
  }

  content = fs.readFileSync( filePath, 'utf8' );
  console.log("Content : " + content);
  
  
  console.log("query :" + query);
  console.log("attrib :" + attrib);

  content = JSON.parse(content);
  console.log("Content :" + JSON.stringify(content));

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