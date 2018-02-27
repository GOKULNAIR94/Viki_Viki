module.exports = function(req, res, callback) {

    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;

    var empName = "";
    empName = req.body.result.contexts[0].parameters['Name'];
    var firstName = empName.split(" ")[0];
    var lastName = empName.split(" ")[1];
    
    
    
    console.log("empName : " + empName);
    console.log("firstName : " + firstName + " " + lastName );
    speech = "firstName : " + firstName + " " + lastName ;
    SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    
//    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=HireDate%3E" + StartDate + "%20and%20%3C" + EndDate + "&onlyData=true";
//
//    Query( qString, req, res, function(result) {
//        if (result.items.length == 0) {
//        speech = "No records found.";
//        } else {
//            speech = "Number of " + HireTermOG + " " + dateperiodOG + " : " + + result.items.length + ".";
//            
//            for (var i = 0; i < result.items.length; i++) {
//                if( HireTerm == "Hire" ){
//                    speech = speech + "\n " + (i + 1) + ". " + result.items[i].FirstName + " " + result.items[i].LastName + ", Hire Date: " + result.items[i].HireDate;
//                }
//                if( HireTerm == "Term" ){
//                    speech = speech + "\n " + (i + 1) + ". " + result.items[i].FirstName + " " + result.items[i].LastName + ", Termination Date: " + result.items[i].TerminationDate; 
//                }
//                
//            }
//        }
//        SendResponse(speech, suggests, contextOut, req, res, function() {
//            console.log("Finished!");
//        });
//        
//    });
    
}
