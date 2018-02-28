module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "";
    empName = req.body.result.contexts[0].parameters['Name'];
    console.log("empName : " + empName);
    var firstName = toTitleCase(empName.split(" ")[0].toLowerCase());
    var lastName = toTitleCase(empName.split(" ")[1].toLowerCase()) ;
    console.log("Name : " + firstName + " " + lastName );
    
    var attribName = "";
    attribName = req.body.result.contexts[0].parameters['hcm_attrib'];
    console.log("attribName : " + attribName);
    var attribName = attribName.split("/")[0];
    var attribCode = attribName.split("/")[1];
    console.log("attribName : " + attribName + " " + attribCode );
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName=" + firstName + ";LastName=" + lastName + "&onlyData=true&expand=assignments";
    
    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
            speech = "No employee found by name " + empName + ".";
            SendResponse(speech, suggests, contextOut, req, res, function() {
                console.log("Finished!");
            });
        } else {
            if (result.items.length == 1) {
                speech =  attribName + ": " + result.items[0].attribCode;
                
                SendResponse(speech, suggests, contextOut, req, res, function() {
                    console.log("Finished!");
                });
                
//                var manId = result.items[0].assignments[0].ManagerId;
//                var jobId = result.items[0].assignments[0].JobId;
//                console.log("ManagerId : " + manId);
//                console.log("job : " + jobId);
//                qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=PersonId=" + manId + "&fields=DisplayName&onlyData=true";

//                Query( qString, req, res, function( manResult) {
//                    var manName = manResult.items[0].DisplayName;
//                    qString = "/hcmCoreSetupApi/resources/11.12.1.0/jobs?q=JobId=" + jobId + "&onlyData=true&&fields=Name";
//                    
//                    Query( qString, req, res, function( jobResult) {
//                        var jobName = jobResult.items[0].Name;
//                        if( jobName != null && jobName != "" )
//                            speech = speech + ",\n" + jobName;
//                        if( result.items[0].City != null && result.items[0].City != "" )
//                            speech = speech + ",\n" + result.items[0].City;
////                        speech = speech + ",\n" + result.items[0].AddressLine1 +  ", " + result.items[0].City +  ", " + result.items[0].Country;
//                        if( result.items[0].WorkEmail != null && result.items[0].WorkEmail != "" )
//                            speech = speech + ",\n" + result.items[0].WorkEmail;
//                        if( result.items[0].WorkPhoneNumber != null && result.items[0].WorkPhoneNumber != "" )
//                            speech = speech + ",\nPhone: " + result.items[0].WorkPhoneNumber;
//                        if( manName != null && manName != "" )
//                            speech = speech + ",\nReports to " + manName;
//
//                        speech = speech +".\n";
//
//                        SendResponse(speech, suggests, contextOut, req, res, function() {
//                            console.log("Finished!");
//                        });
//
//                    });
//                });
            }
            
        }
        
        
    });
    
}
