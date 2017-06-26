module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;
  var speech;
  var intentName = req.body.result.metadata.intentName;

  var Name = "";
  var attrib = "";
    var dateperiodOG = "";
    var attribOG = "";
    var countFlag = 0;

  var filePath = "";
  var query = "";

    attrib = req.body.result.parameters['DCP_AttribsGeneral'];
  attribOG = req.body.result.contexts[0].parameters['DCP_AttribsGeneral.original'];
    if( intentName == "DCP - EmployeeData" ) 
  {
    Name = req.body.result.contexts[0].parameters['Name.original'];
    filePath = "./data/EmployeeData.json";
    query = "Name=" + Name ;
  }

  if( intentName == "DCP - HireTerm" ) 
  {
    
    if( attrib != null && attrib != "" ){
        Name = req.body.result.contexts[0].parameters['Name.original'];
        query = "Name=" + Name ;
    }
    else{
        attrib = "Name"
        var dateperiod = req.body.result.parameters.dateperiod;
        dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
        var StartDate = dateperiod.split("/")[0];
        var EndDate = dateperiod.split("/")[1];
        
        if( req.body.result.parameters['HireTerm'] == "Hire"){
            query = "Hire Date>=" + StartDate + "& Hire Date<=" + EndDate;
        }

        if( req.body.result.parameters['HireTerm'] == "Term"){
            query = "Termination Date>=" + StartDate + "& Termination Date<=" + EndDate;
        }
    }
      
    if( req.body.result.parameters['HireTerm'] == "Hire"){
        filePath = "./data/Hire.json";    
    }
      
    if( req.body.result.parameters['HireTerm'] == "Term"){
        filePath = "./data/Termination .json";
    }
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
      else
          if(output.length > 1){
              if( countFlag == 1 ){
                  var sum = 0;
                    for(var i =0; i < output.length; i++)
                    {
                      sum = sum + parseFloat(output[i]);
                    } 
                  speech = sum + " " + attribOG + " " + dateperiodOG + ".";
              }
              else{
                  speech = "More than one record found.";
              }
          }
  }
   
  
  return res.json({
    speech: speech,
    displayText: speech,
    //source: 'webhook-OSC-oppty'
  })

}