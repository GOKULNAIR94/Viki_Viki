module.exports = function(req, res) {

    var fs = require('fs');
    var jsonQuery = require('json-query');

    var content;
    var speech;
    var intentName = req.body.result.metadata.intentName;

    var Name = "";
    var attrib = "";
    var HireTerm = "";
    var HireTermOG = "";
    var attribOG = "";
    var countFlag = 0;

    var filePath = "";
    var query = "";

    attrib = req.body.result.contexts[0].parameters['DCP_AttribsGeneral'];

    HireTermOG = req.body.result.contexts[0].parameters['HireTerm.original'];
    HireTerm = req.body.result.contexts[0].parameters['HireTerm'];
    if (HireTerm == "Hire")
        filePath = "./data/Hire.json";
    if (HireTerm == "Term")
        filePath = "./data/Termination.json";
    
    
    if ( intentName.indexOf( "DCP - HireTerm - list - attrib" ) == 0 ) {
        Name = req.body.result.contexts[0].parameters['Name.original'];
        //query = "Name = " + Name;
        query = [{
            "key" : "Name",
            "opt" : "==",
            "value" : Name
        }];
        console.log("HireTerm  Here is debuuger: " + HireTerm);


    } else {
        attrib = "Name";
        countFlag = 1;


        var dateperiod = req.body.result.contexts[0].parameters.dateperiod;
        dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
        var StartDate = dateperiod.split("/")[0];
        var EndDate = dateperiod.split("/")[1];

        if (HireTerm == "Hire") {
            //query = "Hire Date >= " + StartDate + " & Hire Date <= " + EndDate;
            query = [{
                "key" : "Hire Date",
                "opt" : ">=",
                "value" : StartDate
            },
            {
                "conj" : "&&",
                "key" : "Hire Date",
                "opt" : "<=",
                "value" : EndDate
            }];
        }

        if (HireTerm == "Term") {
            //query = "Termination Date >= " + StartDate + " & Termination Date <= " + EndDate;
            query = [{
                "key" : "Termination Date",
                "opt" : ">=",
                "value" : StartDate
            },
            {
                "conj" : "&&",
                "key" : "Termination Date",
                "opt" : "<=",
                "value" : EndDate
            }];
        }
    }

    content = fs.readFileSync(filePath, 'utf8');
    console.log("Content : " + content);

    console.log("query :" + query);

    content = JSON.parse(content);
    console.log("Content :" + JSON.stringify(content));

    var output = [];
    for(var i = 0; i < content.length; i++){
        theString = "";
        for( var j=0; j< query.length; j++ ){
            if( j >0 )
                theString = theString + " " + query[j].conj + " ";
            
            theString = theString + ' "' + content[i][query[j].key].toLowerCase() + '"' + query[j].opt + '"' +  query[j].value.toLowerCase() + '" ';
        
        }
        
        console.log( "The String : " + theString );
        
        if( eval( theString ) ){
            output.push( content[i][attrib] );
            console.log("output :" + output);
        }
    }

    console.log("output 123123 :" + output);
    console.log("intentNameintentName :" + intentName);
    console.log("attrib :" + attrib);

    if (output.length == 0) {
        speech = "No records found.";
    } else {
        if (intentName == "DCP - HireTerm - list") {
            speech = "The " + HireTermOG + " " + dateperiodOG + " are : ";
            for (var i = 0; i < output.length; i++) {
                speech = speech + "\n " + (i + 1) + ". " + output[i] + ".";
            }
        } else {
            if (intentName == "DCP - HireTerm - list - attrib" || intentName == "DCP - HireTerm - list - attrib - custom") {
                speech = "The " + attrib + " of " + Name + " is " + output + ".";
            } else
                speech = output.length + " " + HireTermOG + " " + dateperiodOG + ".";
        }
    }
    
    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    })
}
