module.exports = function(req, res) {

    var fs = require('fs');
    var jsonQuery = require('json-query');
    
    var DCPHireTerm = require("./dcpHireTerm");
    
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

    if ( intentName == "DCP - EmployeeData" || intentName == "DCP - EmployeeData - custom" ) {
        Name = req.body.result.contexts[0].parameters['Name.original'];
        filePath = "./data/EmployeeData.json";
        query = "Name = " + Name;
    }

    if (intentName == "DCP - HeadCount") {
        //attrib = "Headcount";
        filePath = "./data/Headcount.json";
        if (req.body.result.parameters.ED_Dept != null && req.body.result.parameters.ED_Dept != "")
            query = "Department = " + req.body.result.parameters.ED_Dept;
        if (req.body.result.parameters.ED_WorkLocation != null && req.body.result.parameters.ED_WorkLocation != "")
            query = "Location = " + req.body.result.parameters.ED_WorkLocation;

    }

    if (intentName.indexOf( "DCP - HireTerm" ) == 0 ) {
        DCPHireTerm(req, res, function(result) {
          console.log("EmpData Called");
        });
    }
    
    if (intentName == "DCP - WorklistApproval") {
        Name = req.body.result.contexts[0].parameters['Name.original'];
        filePath = "./data/WorklistApproval.json";
        query = "Employee = " + Name;
        attrib = "Details";
    }


    content = fs.readFileSync(filePath, 'utf8');
    console.log("Content : " + content);


    console.log("query :" + query);

    content = JSON.parse(content);
    console.log("Content :" + JSON.stringify(content));

    var output =
        jsonQuery('[* ' + query + ']' + '[' + attrib + ']', {
            data: content
        }).value;
    console.log("output :" + output);

    if (output.length == 0) {
        speech = "No records found.";
    } else {
        if( intentName == "DCP - WorklistApproval"){
            speech = "There are " + output.length + " approval(s) pending. ";
            for( var i = 0; i < output.length; i++){
                speech = speech + "\n " + (i+1) + ". " + output[i] + ".";
            }
        }
        else{
           if (output.length == 1) {
                speech = output[0];
            } else
            if (output.length > 1) {
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