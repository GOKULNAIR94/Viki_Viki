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

    HireTermOG = req.body.result.contexts[0].parameters['HireTerm.original'];
    if (attrib != null && attrib != "") {
        Name = req.body.result.contexts[0].parameters['Name.original'];
        query = "Name = " + Name;
        if (attrib = "Hire Date")
            filePath = "./data/Hire.json";
        if (attrib = "Termination Date")
            filePath = "./data/Termination.json";
    } else {
        attrib = "Name";
        countFlag = 1;
        var HireTerm = req.body.result.contexts[0].parameters['HireTerm'];

        var dateperiod = req.body.result.contexts[0].parameters.dateperiod;
        dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
        var StartDate = dateperiod.split("/")[0];
        var EndDate = dateperiod.split("/")[1];

        if ( HireTerm == "Hire") {
            query = "Hire Date >= " + StartDate + " & Hire Date <= " + EndDate;
        }

        if ( HireTerm == "Term") {
            query = "Termination Date >= " + StartDate + " & Termination Date <= " + EndDate;
        }
    }

    if ( HireTerm == "Hire") {
        filePath = "./data/Hire.json";
    }

    if ( HireTerm == "Term") {
        filePath = "./data/Termination.json";
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
    console.log("intentNameintentName :" + intentName);
    if (output.length == 0) {
        speech = "No records found.";
    } else {
        if( intentName == "DCP - HireTerm - list"){
            speech = "The " + HireTermOG + " " + dateperiodOG + "are : ";
            for( var i = 0; i < output.length; i++){
                speech = speech + "\n " + (i+1) + ". " + output[i] + ".";
            }
        }
        else{
            speech = output.length + " " + HireTermOG + " " + dateperiodOG + ".";
        }            
    }


    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    })

}