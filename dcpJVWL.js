module.exports = function(req, res) {
    var intentName = req.body.result.metadata.intentName;
    var fs = require('fs');
    var jsonQuery = require('json-query');

    var content;
    var speech;
    
    var jrnlId = req.body.result.contexts[0].parameters['JOURNAL_ID'];
    var attrib = req.body.result.contexts[0].parameters['JRNLAttrib'];
    
    var filePath = "";
    var query = "";
    
    filePath = "./data/JournalTable.json";
    //query = "JOURNAL_ID = " + jrnlId;
    query = [{
                "key" : "JOURNAL_ID",
                "opt" : "==",
                "value" : jrnlId
            }];
    
    
    content = fs.readFileSync(filePath, 'utf8');

    content = JSON.parse(content);
    //console.log("Content :" + JSON.stringify(content));

    var output = [];
    for(var i = 0; i < content.length; i++){
        theString = '"' + content[i][query[0].key].toLowerCase() + '"' + query[0].opt + '"' +  query[0].value.toLowerCase() + '"';
        console.log( "The String : " + theString );
        if( eval( theString ) ){
            output.push( content[i][attrib] );
            console.log("output : " + output);
            if ( output  == "Posted" ){
                var posteddate = content[i]["POSTED_DATE"];
                speech = "The status of journal " + jrnlId + " is " + output + ".\n Posted date is : " + posteddate;
            }
            if( output == "Error"){
                var posteddate = content[i]["ERROR"];
                speech = "The status of journal " + jrnlId + " is " + output + ".\n Reason is : " + errormsg;
            }
            if( output == "New"){
                speech = "The status of journal " + jrnlId + " is " + output + ".";
            }
        }
    }
    console.log("output :" + output );
    
    if (output.length == 0) {
        speech = "No records found.";
    }
    
    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    })
}
