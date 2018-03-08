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
//    speech = "Name : " + firstName + " " + lastName ;
//    SendResponse(speech, suggests, contextOut, req, res, function() {
//        console.log("Finished!");
//    });   result.items[0].FirstName
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName=" + firstName + ";LastName=" + lastName + "&onlyData=true&expand=assignments";
//    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName.toUpperCase()=" + firstName + ".toUpperCase();LastName.toUpperCase()=" + lastName + ".toUpperCase();FirstName!=null&onlyData=true";
//    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=upper(FirstName)in(" + firstName.toUpperCase() + "," + lastName.toUpperCase() + ");upper(LastName)in(" + firstName.toUpperCase() + "," + lastName.toUpperCase() + ");FirstName!=null&onlyData=true";
    
    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
            speech = "No employee found by name " + empName + ".";
            speech = speech +". \nAnything else I can help you with?";
            SendResponse(speech, suggests, contextOut, req, res, function() {
                console.log("Finished!");
            });
        } else {
            if (result.items.length >= 1) {
                speech = "" + result.items[0].DisplayName;
                
                var manId = result.items[0].assignments[0].ManagerId;
                var jobId = result.items[0].assignments[0].JobId;
                var locId = result.items[0].assignments[0].LocationId;
                console.log("ManagerId : " + manId);
                console.log("job : " + jobId);
                console.log("locId : " + locId);
                
                

                if( result.items[0].WorkEmail != null && result.items[0].WorkEmail != "" )
                    speech = speech + ",\nEmail: " + result.items[0].WorkEmail;
                if( result.items[0].WorkPhoneNumber != null && result.items[0].WorkPhoneNumber != "" )
                    speech = speech + ",\nPhone: " + result.items[0].WorkPhoneNumber;
                
//                        speech = speech + ",\n" + result.items[0].AddressLine1 +  ", " + result.items[0].City +  ", " + result.items[0].Country;
                if(locId != null && locId != ""){
                    qString = "/hcmCoreApi/resources/11.12.1.0/locations?q=LocationId=" + locId + "&fields=LocationName&onlyData=true";
                    Query( qString, req, res, function( locResult) {
                        var locName = locResult.items[0].LocationName;
                        console.log("Location: "+ locName);
                        if( locName != null && locName != "" )
                                speech = speech + ",\nLocation: " + locName;
                        
                        if( manId != null && manId != "" && jobId != null && jobId != ""){
                            qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=PersonId=" + manId + "&fields=DisplayName&onlyData=true";
                            Query( qString, req, res, function( manResult) {
                                var manName = manResult.items[0].DisplayName;
                                qString = "/hcmCoreSetupApi/resources/11.12.1.0/jobs?q=JobId=" + jobId + "&onlyData=true&&fields=Name";

                                Query( qString, req, res, function( jobResult) {
                                    var jobName = jobResult.items[0].Name;
                                    if( jobName != null && jobName != "" )
                                        speech = speech + ",\nDesignation: " + jobName;

                                    if( manName != null && manName != "" )
                                        speech = speech + ",\nReporting Manager: " + manName;


                                    speech = speech +". \nAnything else I can help you with?";
                                    SendResponse(speech, suggests, contextOut, req, res, function() {
                                        console.log("Finished!");
                                    });


                                });
                            });
                        }
                        else{
                            speech = speech +". \nAnything else I can help you with?";
                            SendResponse(speech, suggests, contextOut, req, res, function() {
                                console.log("Finished!");
                            });
                        }
                    });
                }
                
                
            }
            
            
            
            
        }
        
        
    });
    
}
