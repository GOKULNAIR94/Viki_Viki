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
    var HeadCountQuery = "";
    
    

    if ( intentName == "ADS_SNIncident" ) {
        attrib = req.body.result.parameters['ADS_attrib'];
        
        number = req.body.result.parameters['Number'];
        
        filePath = "./data/ServiceNow.json";
        
        query = [{
            "key" : "Number",
            "opt" : "==",
            "value" : number
        }];
    }
    
    content = fs.readFileSync(filePath, 'utf8');
    content = JSON.parse(content);
    
    console.log("Content :" + JSON.stringify(content));
    console.log("query :" + query);
    console.log("attrib :" + attrib);
    
    var output = [];
    for(var i = 0; i < content.length; i++){

        theString = '"' + content[i][query[0].key].toString().toLowerCase() + '"' + query[0].opt + '"' +  query[0].value.toString().toLowerCase() + '"';
        console.log( "The String : " + theString );
        if( eval( theString ) ){
            output.push( content[i][attrib] );
            console.log("output :" + output);
            if ( intentName.indexOf( "DCP - HeadCount" ) == 0 )
                break;
        }
    }
    
    console.log("output :" + output);
    if (output.length == 0) {
        speech = "No records found.";
    }
    else{
        if( output.length == 1 ){
            speech = "The " + attrib + " of incident" + number + " is " + output[0] + ".";
        }
    }
    
    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    });

}
