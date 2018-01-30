module.exports = function(req, res ) {
    var Query = require("./query");
    
    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    var loginEncoded = "";
    var speech = "";
    
    if ( intentName == "KIR_Partners" ) {
        
        qString = "/salesApi/resources/latest/partners";
        
        Query( qString, loginEncoded, req, res, function(result) {
            
            speech = JSON.stringify(result);
            console.log(" speech : " + speech);
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        });
        
    }
}
