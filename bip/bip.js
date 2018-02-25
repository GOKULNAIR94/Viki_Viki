module.exports = function(req, res ) {
    var Run = require("./run");
    var Schedule = require("./schedule");
    var SendResponse = require("./sendResponse");
    var suggests = [];
    var contextOut = [];
    //var intentName = req.body.result.metadata.intentName;
        
//    Run( req, res, function(result) {
//        console.log("Run Called.");
//    });
    
    Schedule( req, res, function(result) {
        console.log("Schedule Called.");
        speech = "Report has been scheduled. Job Id : " + result.scheduleReportReturn;
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
}
