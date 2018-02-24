module.exports = function(req, res ) {
    var RUN = require("./run");
    
    var intentName = req.body.result.metadata.intentName;
    
    if ( intentName.indexOf("KIR_Partners") == 0  ) {
        Run( req, res, function(result) {
            console.log("Partners Called.");
        });
    }
}
