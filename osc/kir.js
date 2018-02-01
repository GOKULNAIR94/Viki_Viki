module.exports = function(req, res ) {
    var Partners = require("./partners");
    
    var intentName = req.body.result.metadata.intentName;
    
    if ( intentName == "KIR_Partners" ) {
        Partners( req, res, function(result) {
            console.log("Partners Called.");
        });
    }
}
