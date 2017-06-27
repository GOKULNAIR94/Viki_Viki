module.exports = function(req, res) {

  var fs = require('fs');
  var jsonQuery = require('json-query');

  var content;
  var speech;
  var intentName = req.body.result.metadata.intentName;

  var Name = "";
  var attrib = "";
    var HireTermOG = "";
    var attribOG = "";
    var countFlag = 0;

  var filePath = "";
  var query = "";

    attrib = req.body.result.parameters['DCP_AttribsGeneral'];
  console.log("attrib :" + attrib);
  
    if( intentName == "DCP - EmployeeData" ) 
  {
    Name = req.body.result.contexts[0].parameters['Name.original'];
    filePath = "./data/EmployeeData.json";
    query = "Name = " + Name ;
  }
    
    if( intentName == "DCP - HeadCount" ) 
  {
      //attrib = "Headcount";
    filePath = "./data/Headcount.json";
      if( req.body.result.parameters.ED_Dept != null && req.body.result.parameters.ED_Dept != "" )
        query = "Department = " + ED_Dept ;
      if( req.body.result.parameters.ED_WorkLocation != null && req.body.result.parameters.ED_WorkLocation != "" )
        query = "Location = " + ED_WorkLocation ;
      
  }

  if( intentName == "DCP - HireTerm" ) 
  {
    HireTermOG = req.body.result.contexts[0].parameters['HireTerm.original'];
    if( attrib != null && attrib != "" ){
        Name = req.body.result.contexts[0].parameters['Name.original'];
        query = "Name = " + Name ;
        if( attrib = "Hire Date" )
           filePath = "./data/Hire.json"; 
        if( attrib = "Termination Date" )
            filePath = "./data/Termination.json";
    }
    else{
        attrib = "Name";
        countFlag = 1;

        var dateperiod = req.body.result.parameters.dateperiod;
        dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
        var StartDate = dateperiod.split("/")[0];
        var EndDate = dateperiod.split("/")[1];
        
        if( req.body.result.parameters['HireTerm'] == "Hire"){
            query = "Hire Date >= " + StartDate + " & Hire Date <= " + EndDate;
        }

        if( req.body.result.parameters['HireTerm'] == "Term"){
            query = "Termination Date >= " + StartDate + " & Termination Date <= " + EndDate;
        }
    }
      
    if( req.body.result.parameters['HireTerm'] == "Hire"){
        filePath = "./data/Hire.json";    
    }
      
    if( req.body.result.parameters['HireTerm'] == "Term"){
        filePath = "./data/Termination.json";
    }
  }

  content = fs.readFileSync( filePath, 'utf8' );
  console.log("Content : " + content);
  
  
  console.log("query :" + query);

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
                  
                  speech = output.length + " " + HireTermOG + " " + dateperiodOG + ".";
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