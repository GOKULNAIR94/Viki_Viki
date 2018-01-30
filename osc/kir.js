module.exports = function(req, res ) {
    var Query = require("./query");
    
    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    var loginEncoded = "";
    var speech = "";
    
    if ( intentName == "KIR_Partners" ) {
        
        qString = "/salesApi/resources/latest/partners?onlyData=true";
        
        Query( qString, loginEncoded, req, res, function(result) {
            if( result.items.length <= 0 ){
                speech = "No records found";
            }
            else{
                for(var i = 0; i < result.items.length; i++){
                    speech = speech + " " + (i+1) + ". " + result.items[i].OrganizationName + ".\n";

                }  
            }
            console.log(" speech : " + speech);
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        });
        
    }
}
