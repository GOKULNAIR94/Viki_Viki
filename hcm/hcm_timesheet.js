module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    var QueryDB = require("./queryDB");
    var SendResponse = require("./sendResponse");
    var SendEmail = require("./sendEmail");
    var emailContent = {};
    var intentName = req.body.result.metadata.intentName;
    
    var qString = "";
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "",firstName="",lastName="";
    var hours = "",task="";
    var tmdates =[];
    
    switch (true) {
            
            case (intentName == "hcm_timesheet_my"):{
                var dDate = new Date().toISOString().split("T")[0];
                qString = "Select * from TimeSheets WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND Date<'" + dDate + "'";
                break;
            }
            case (intentName == "hcm_timesheet_my_fill_these"):{
                var dDate = new Date().toISOString().split("T")[0];
                hours = req.body.result.parameters['hours'];
                task = req.body.result.parameters['task'];
                qString = "UPDATE TimeSheets SET ApprovalStatus='Pending', Hours='"+hours+"', RemainingHours='" + (9-hours)+"', Task='"+task+"' WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND Date<'" + dDate + "'";
                break;
            }   
    }
    
    console.log("Qstring : " + qString);

    if( qString != null && qString!= ""){
        QueryDB( qString, req, res, function(result) {
            if( result.rowsAffected == 0){
                speech = "No records found.";
                SendResponse(speech, suggests, contextOut, req, res, function() {
                    console.log("Finished!");
                });
            }else{
                switch (true) {
                    case (intentName == "hcm_timesheet_my"):{
                        
                        speech = "Your timesheet booking is not done for the following dates:";
                        for(var i=0;i < result.recordset.length; i++){
                            speech = speech + "" + result.recordset[i].Date.toISOString().split("T")[0] + ";";
                            tmdates[i] = result.recordset[i].Date.toISOString().split("T")[0];
                        }
                        contextOut = [{
                            "name": "tmdates",
                            "lifespan": 1,
                            "parameters": {
                                "tmdates": tmdates
                            }
                        }];
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                        break;
                    }
                        
                    case (intentName == "hcm_timesheet_my_fill_these"):{
                        var array = req.body.result.contexts;
                        for( var key in array ){
                            console.log("**************************\narray "+ key +" : " + JSON.stringify(array[key]));
                            if( array[key].name == "tmdates"){
                                tmdates = array[key].parameters["tmdates"];
                                break;
                            } 
                        }
                        var emailBody = '<p><b>Hello Rhea,</b></p>' +
                            '<p>Kaaman Agarwal has sent the following timesheet for you approval:</p><p>';
                        for(var j=0; j< result.recordset.length; j++){
                            emailBody = emailBody + ''+ tmdates[j] +'; ';
                        }
                        emailBody = emailBody + '</p>';
                        emailContent = {};
                        emailContent.speech = "Your timesheet booking has been sent to Rhea for approval.";
                        emailContent.subject = "Timesheet sent for your approval";
                        emailContent.body =  emailBody;

                        SendEmail( emailContent, req, res, function(result) {
                            console.log("SendEmail Called");
                        });
                        break;
                    }
                }
            }
            
        });
    }else{
        speech = "Unable to process your request. Please try again later."
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    }
}
