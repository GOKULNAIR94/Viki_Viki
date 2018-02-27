module.exports = function(req, res, callback) {

    var toTitleCase = require("titlecase");
    
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
    console.log("Name : " + firstName + " " + lastName );
    speech = "Name : " + firstName + " " + lastName ;
//    SendResponse(speech, suggests, contextOut, req, res, function() {
//        console.log("Finished!");
//    });
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName.toUpperCase()=" + firstName + ".toUpperCase();LastName.toUpperCase()=" + lastName + ".toUpperCase();FirstName!=null&onlyData=true";

    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
        speech = "No records found.";
        } else {
            speech = "Done. : " + JSON.stringify(result);
            
//            for (var i = 0; i < result.items.length; i++) {
//            }
        }
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
        
    });
    
}
