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
                qString = "UPDATE LeavesTable SET ApprovalStatus='Pending',Hours='"+hours+"',RemainingHours='" + (9-hours)+"',Task='"+task+"' WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND ApprovalStatus!='Approved' AND Date<'" + dDate + "'";
                break;
            }
            
            
            
    }
    
    console.log("Qstring : " + qString);

    if( qString != null && qString!= ""){
        QueryDB( qString, req, res, function(result) {
            if( result.rowsAffected == 0){
                speech = "No records found.";
            }else{
                switch (true) {
                    case (intentName == "hcm_timesheet_my"):{
                        speech = "Your timesheet booking is not done for the following dates:";
                        for(var i=0;i < result.recordset.length; i++){
                            speech = speech + "" + result.recordset[i].Date.toISOString().split("T")[0] + ";";
                        }
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                        break;
                    }
                        
                    case (intentName == "hcm_timesheet_my_fill_these"):{
                        speech = "Your timesheet booking is subitted succesfully:";
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
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
