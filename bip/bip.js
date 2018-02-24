module.exports = function(req, res ) {
    var Run = require("./run");
    
    var intentName = req.body.result.metadata.intentName;
        
    Run( req, res, function(result) {
        console.log("Partners Called.");
    });
}
