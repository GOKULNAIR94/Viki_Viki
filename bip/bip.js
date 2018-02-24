module.exports = function(req, res ) {
    var Run = require("./run");
    var Schedule = require("./schedule");
    
    var intentName = req.body.result.metadata.intentName;
        
    Run( req, res, function(result) {
        console.log("Run Called.");
    });
    
    Schedule( req, res, function(result) {
        console.log("Schedule Called.");
    });
}
