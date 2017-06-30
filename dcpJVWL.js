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
    query = "JOURNAL_ID = " + jrnlId;
    
    content = fs.readFileSync(filePath, 'utf8');

    content = JSON.parse(content);
    //console.log("Content :" + JSON.stringify(content));

    var output =
        jsonQuery('[* ' + query + ']' + '[' + attrib+ ']', {
            data: content
        }).value;
    
    console.log("output :" + output );
    if (output.length == 0) {
        speech = "No records found.";
    } else {
        if (output.length == 1) {
            if ( intentName.indexOf( "DCP - JRNL" ) == 0 ){
                if( output == "Posted"){
                   var posteddate =
                        jsonQuery('[* ' + query + ']' + '[POSTED_DATE]', {
                        data: content
                    }).value;
                    speech = "The status of journel " + jrnlId + " is " + output + ".\n Posted date is : " + posteddate;
                }
                
                if( output == "Error"){
                   var errormsg =
                        jsonQuery('[* ' + query + ']' + '[ERROR]', {
                        data: content
                    }).value;
                    speech = "The status of journel " + jrnlId + " is " + output + ".\n Reason is : " + errormsg;
                }
                if( output == "New"){
                    speech = "The status of journel " + jrnlId + " is " + output + ".";
                }
                
            }
        } else
            if (output.length > 1) {
                speech = "More than one record found.";
            }
    }
    
    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    })
}
