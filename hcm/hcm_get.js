module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var Query = require("./query");
    var Update = require("./update");
    var SendResponse = require("./sendResponse");
    var SendEmail = require("./sendEmail");
    var HCMtransfer = require("./hcm_transfer");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    
    var intentName = req.body.result.metadata.intentName;

    var empName = "";
    empName = req.body.result.contexts[0].parameters['Name'];
    console.log("empName : " + empName);
    var firstName = toTitleCase(empName.split(" ")[0].toLowerCase());
    var lastName = toTitleCase(empName.split(" ")[1].toLowerCase()) ;
    console.log("Name : " + firstName + " " + lastName );
    
    var attrib = "";
    attrib = req.body.result.contexts[0].parameters['hcm_attrib'];
    console.log("attrib : " + attrib);
    
    attrib = attrib.split("/");
    var attribName="", attribCode = "", collection = "";
    
    if( attrib.length == 3){
        attribName = attrib[0];
        collection = attrib[1];
        attribCode = attrib[2];
    }
    else{
        if( attrib.length == 2){
            attribName = attrib[0];
            attribCode = attrib[1];
        }
    }
    console.log("attrib : " + attrib + " " + attrib.length );
    
    
        
        
        var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName=" + firstName + ";LastName=" + lastName + "&expand=assignments";
    
        Query( qString, req, res, function(result) {
            if (result.items.length == 0) {
                speech = "No employee found by name " + empName + ".";
                SendResponse(speech, suggests, contextOut, req, res, function() {
                    console.log("Finished!");
                });
            } else {
                if (result.items.length >= 1) {
                    if(attrib.length == 2){
                        if( intentName == "hcm_get_one_update"){
                            console.log("Update : " + result.toString() );
                            var empsId = result.items[0].links[0].href;
                            console.log("href! : " + empsId );
                            empsId = empsId.split("emps/")[1];
                            console.log("empsId : " + empsId);
                            qString = "/hcmCoreApi/resources/11.12.1.0/emps/" + empsId; //00020000000EACED00057708000110D9317FA60C0000004AACED00057372000D6A6176612E73716C2E4461746514FA46683F3566970200007872000E6A6176612E7574696C2E44617465686A81014B5974190300007870770800000161D9B5680078
                            var attribValue = req.body.result.parameters['attribValue'];
                            var body = {};
                            body[attribCode] = attribValue;
    //                        body["attribName"] = attribName;

                            Update( qString, body, success, req, res, function(result) {
                                console.log("Update called");
                                speech = firstName + "'s " + attribName + " has been updated to " + attribValue;
                                speech = speech + " \nAnything else I can help you with?";
                                SendResponse(speech, suggests, contextOut, req, res, function() {
                                    console.log("Finished!");
                                });
                            });
                        }
                        else{
                            speech =  firstName + "'s " + attribName + ": " + result.items[0][attribCode] + ".";
                            speech = speech + " \n Anything else I can help you with?";
            //                console.log("result : " + JSON.stringify(result.items[0]));
                            SendResponse(speech, suggests, contextOut, req, res, function() {
                                console.log("Finished!");
                            });
                        }
                    }else{
                        if( attrib.length == 3){
                            if( intentName == "hcm_get_one_update"){
                                if( attribName != "Location"){
                                    speech =  "Lets do that in the next version.";
                    //                console.log("result : " + JSON.stringify(result.items[0]));
                                    SendResponse(speech, suggests, contextOut, req, res, function() {
                                        console.log("Finished!");
                                    });
                                }else{
                                    HCMtransfer(req, res, function(result) {
                                        console.log("HCM_transfer Called");
                                    });
                                }
                                 
                            }
                            else{
                                if(attribCode == "JobId"){
                                    var jobId = result.items[0].assignments[0].JobId;
                                    qString = "/hcmCoreSetupApi/resources/11.12.1.0/jobs?q=JobId=" + jobId + "&onlyData=true&&fields=Name";
                                }

                                if( attribCode == "ManagerId"){
                                    var manId = result.items[0].assignments[0].ManagerId;
                                    qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=PersonId=" + manId + "&fields=DisplayName&onlyData=true";
                                }
                                
                                if( attribCode == "LocationId"){
                                    var locId = result.items[0].assignments[0].LocationId;
                                    qString = "/hcmCoreSetupApi/resources/11.12.1.0/locations?q=LocationId=" + locId + "&fields=LocationName&onlyData=true";
                                }

                                Query( qString, req, res, function( collResult) {
                                    console.log("Col Results: " + collResult);
                                    if(attribCode == "JobId"){
                                        speech =  firstName + "'s " + attribName + ": " + collResult.items[0].Name + ".";
                                    }

                                    if( attribCode == "ManagerId"){
                                        speech =  firstName + " reports to " + collResult.items[0].DisplayName + ".";
                                    }
                                    if( attribCode == "LocationId"){
                                        speech =  firstName + " is located at " + collResult.items[0].LocationName + ".";
                                    }

                                    speech = speech + " \nAnything else I can help you with?";
                                    SendResponse(speech, suggests, contextOut, req, res, function() {
                                        console.log("Finished!");
                                    });

                                });
                            }
                        }
                    }
                }

            }


        });
        
    
    
}
