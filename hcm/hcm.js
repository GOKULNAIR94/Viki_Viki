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
    console.log("Name : " + firstName + " " + lastName );
//    speech = "Name : " + firstName + " " + lastName ;
//    SendResponse(speech, suggests, contextOut, req, res, function() {
//        console.log("Finished!");
//    });   result.items[i].FirstName
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName=" + firstName + ";LastName=" + lastName + "&onlyData=true";
//    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName.toUpperCase()=" + firstName + ".toUpperCase();LastName.toUpperCase()=" + lastName + ".toUpperCase();FirstName!=null&onlyData=true";
//    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=upper(FirstName)in(" + firstName.toUpperCase() + "," + lastName.toUpperCase() + ");upper(LastName)in(" + firstName.toUpperCase() + "," + lastName.toUpperCase() + ");FirstName!=null&onlyData=true";
    
    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
        speech = "No records found.";
        } else {
            speech = "Done. : " + JSON.stringify(result);
            for (var i = 0; i < result.items.length; i++) {
                speech = "Name: " + result.items[i].DisplayName;
                if( result.items[i].WorkPhoneNumber != null && result.items[i].WorkPhoneNumber != "" )
                    speech = speech + "Work phone: " + result.items[i].WorkPhoneNumber;
                if( result.items[i].WorkPhoneNumber != null && result.items[i].WorkPhoneNumber != "" )
                    speech = speech + "Work phone: " + result.items[i].WorkPhoneNumber;
                if( result.items[i].City != null && result.items[i].City != "" )
                    speech = speech + "located at " + result.items[i].City;
                speech = speech +".\n";
            }
        }
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
        
    });
    
}
