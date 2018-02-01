module.exports = function(req, res ) {
    var Partners = require("./partners");
    
    var intentName = req.body.result.metadata.intentName;
    
    if ( intentName.indexOf("KIR_Partners") == 0  ) {
        Partners( req, res, function(result) {
            console.log("Partners Called.");
        });
    }
}
