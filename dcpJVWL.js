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
    console.log("Content :" + JSON.stringify(content));

    var output =
        jsonQuery('[* ' + query + ']' + '[' + attrib+ ',POSTED_DATE ]', {
            data: content
        }).value;
    
    console.log("output :" + output );
    if (output.length == 0) {
        speech = "No records found.";
    } else {
        if (output.length == 1) {
            if ( intentName.indexOf( "DCP - JRNL" ) == 0 ){
                speech = "The " + attrib + " of journel " + jrnlId + " is " + output + ".";
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
