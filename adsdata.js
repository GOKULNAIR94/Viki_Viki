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
    var os = require('os');
    

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
            output.push( content[i] );
            console.log("output :" + output);
        }
    }
    
    console.log("output :" + output);
    if (output.length == 0) {
        speech = "No records found.";
    }
    else{
        if( output.length == 1 ){
            speech = "Details of incident : " + number + ": " + os.EOL;
            
            if( output[0]["Opened"] != null )
                speech = speech + "Opened date : " + output[0]["Opened"] + "." + os.EOL; 
            
            if( output[0]["State"] != null )
                speech = speech + "Status : " + output[0]["State"] + "." + os.EOL; 
            
            if( output[0]["Short description"] != null )
                speech = speech + "Description : " + output[0]["Short description"] + "." + os.EOL; 
            
            if( output[0]["Comments and Work notes"] != null )
                speech = speech + "Notes : " + output[0]["Comments and Work notes"] + "." + os.EOL;
                
        }
    }
    
    return res.json({
        speech: speech,
        displayText: speech,
        //source: 'webhook-OSC-oppty'
    });

}
