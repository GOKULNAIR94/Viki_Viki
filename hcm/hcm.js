module.exports = function(req, res, callback) {

    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;

    var HireTerm = "";
    HireTerm = req.body.result.contexts[0].parameters['HireTerm'];
    var HireTermOG = "";
    HireTermOG = req.body.result.contexts[0].parameters['HireTerm.original'];
        
    
    var dateperiod = req.body.result.contexts[0].parameters.dateperiod;
    var dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
    var StartDate = dateperiod.split("/")[0];
    var EndDate = dateperiod.split("/")[1];
    
    console.log("HireTerm :" + HireTerm);
    console.log("dateperiod :" + dateperiod);
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=HireDate%3E" + StartDate + "%20and%20%3C" + EndDate + "&onlyData=true";

    Query( qString, req, res, function(result) {
        if (result.length == 0) {
        speech = "No records found.";
        } else {
            speech = "Number of " + HireTermOG + " " + dateperiodOG + " : " + + result.length + ".";
            
//            for (var i = 0; i < result.length; i++) {
//                if( HireTerm == "Hire" ){
//                    speech = speech + "\n " + (i + 1) + ". " + result[i].FirstName + " " + result[i].LastName + ", Hire Date: " + result[i].HireDate;
//                }
//                if( HireTerm == "Term" ){
//                    speech = speech + "\n " + (i + 1) + ". " + result[i].FirstName + " " + result[i].LastName + ", Termination Date: " + result[i].TerminationDate; 
//                }
//                
//            }
        }
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
        
    });
    
}
