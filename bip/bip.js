module.exports = function(req, res ) {
    var RUN = require("./run");
    
    var intentName = req.body.result.metadata.intentName;
        
    Run( req, res, function(result) {
        console.log("Partners Called.");
    });
}
