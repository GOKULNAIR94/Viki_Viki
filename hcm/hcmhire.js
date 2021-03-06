module.exports = function(req, res, callback) {

    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;

    var HireTerm = "";
    HireTerm = req.body.result.parameters['HireTerm'];
    var HireTermOG = "";
    HireTermOG = req.body.result.contexts[0].parameters['HireTerm.original'];
        
    console.log("req.body.result : " + JSON.stringify(req.body.result));
    var dateperiod = req.body.result.contexts[0].parameters.dateperiod;
    var dateperiodOG = req.body.result.contexts[0].parameters['dateperiod.original'];
    console.log("Date : " + dateperiod);
    var StartDate = dateperiod.split("/")[0];
    var EndDate = dateperiod.split("/")[1];
    
    console.log("HireTerm : " + HireTerm);
    console.log("dateperiod : " + dateperiod);
    
    var qString = "";
    if( HireTerm == "Hire" ){
        qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=HireDate%3E%3D" + StartDate + "%20and%20%3C%3D" + EndDate + "&onlyData=true";
    }
    if( HireTerm == "Term" ){
        qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=TerminationDate%3E%3D" + StartDate + "%20and%20%3C%3D" + EndDate + "&onlyData=true";
    }

    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
        speech = "No "+HireTermOG+" " +dateperiodOG+ ".";
        } else {
            speech = "Number of " + HireTermOG + " " + dateperiodOG + " : " + + result.items.length + ".";
            
            for (var i = 0; i < result.items.length; i++) {
                if( HireTerm == "Hire" ){
                    speech = speech + "\n " + (i + 1) + ". " + result.items[i].FirstName + " " + result.items[i].LastName + ", Hire Date: " + result.items[i].HireDate;
                }
                if( HireTerm == "Term" ){
                    speech = speech + "\n " + (i + 1) + ". " + result.items[i].FirstName + " " + result.items[i].LastName + ", Termination Date: " + result.items[i].TerminationDate; 
                }
                
            }
        }
        speech = speech +". \nIs there anything else I can assist you with?";
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
        
    });
    
}
