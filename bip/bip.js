module.exports = function(req, res ) {
    var Run = require("./run");
    var Schedule = require("./schedule");
    var SendResponse = require("./sendResponse");
    var suggests = [];
    var contextOut = [];
    var speech = "";
    //var intentName = req.body.result.metadata.intentName;
        
//    Run( req, res, function(result) {
//        console.log("Run Called. : \n" + result);
//        speech = "Job Run.";
//        SendResponse(speech, suggests, contextOut, req, res, function() {
//            console.log("Finished!");
//        });
//    });
    
    Schedule( req, res, function(result) {
        console.log("Schedule Called.");
        speech = "You request has been scheduled. Job Id : " + (result.scheduleReportReturn +1 ) + ". The payslip will be generated and mailed to you in a couple of minutes. Anything else I can help you with?";
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
}
