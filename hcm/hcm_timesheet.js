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
    var dDate;
    
    switch (true) {
            
            case (intentName == "hcm_timesheet_my"):{
                dDate = new Date().toISOString().split("T")[0];
                qString = "Select * from TimeSheets WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND Date<='" + dDate + "'";
                break;
            }
            case (intentName == "hcm_timesheet_my_fill_these"):{
                dDate = new Date().toISOString().split("T")[0];
                hours = req.body.result.parameters['hours'];
                task = req.body.result.parameters['task'];
                qString = "UPDATE TimeSheets SET ApprovalStatus='Pending', Hours='"+hours+"', RemainingHours='" + (9-hours)+"', Task='"+task+"' WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND Date<='" + dDate + "'";
                break;
            }  
            case (intentName == "hcm_timesheet_my_fill_more"):{
                tmdates = req.body.result.parameters['dates'];
                var fillPeriod = req.body.result.parameters['dateperiod'];
                hours = req.body.result.parameters['hours'];
                task = req.body.result.parameters['task'];
                if( tmdates != null){
                    qString = "UPDATE TimeSheets SET ApprovalStatus='Pending', Hours='"+hours+"', RemainingHours='" + (9-hours)+"', Task='"+task+"' WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND (Date='" + tmdates[0] + "'";
                    for(var d=1; d< tmdates.length; d++){
                        qString = qString + " OR Date='" + tmdates[d] + "'";
                    }
                    qString = qString + " )";
                }else{
                    if( fillPeriod != null){
                        var StartDate = fillPeriod.split("/")[0];
                        var i =0;
                        tmdates[i] = StartDate;
                        var EndDate = fillPeriod.split("/")[1];
                        dDate = new Date(StartDate);
                        qString = "UPDATE TimeSheets SET ApprovalStatus='Pending', Hours='"+hours+"', RemainingHours='" + (9-hours)+"', Task='"+task+"' WHERE EmployeeName LIKE '%Kaaman%' AND Hours='0' AND (Date='" + StartDate + "'";
                        var formatDate = "";
                        dDate.setDate(dDate.getDate() + 1);
                        i++;
                        while( dDate <= new Date(EndDate)){
                            formatDate = dDate.getFullYear() + "-" + (dDate.getMonth()+1) + "-" + dDate.getDate();
                            tmdates[i] = formatDate;
                            qString = qString + " OR Date='" + formatDate + "'";
                            dDate.setDate(dDate.getDate() + 1); i++;
                        }                        
                    }
                }
                break;
            }   
            case (intentName == "hcm_timesheet_approval"):{
                dDate = new Date().toISOString().split("T")[0];
                qString = "Select * from TimeSheets WHERE ApprovalStatus='Pending' AND Date<='"+dDate+"' ORDER BY EmployeeName, Date";
                break;
            }
            case (intentName == "hcm_timesheet_approval_approve"):{    
                empName = req.body.result.contexts[0].parameters['Name'];
                console.log("empName : " + empName);
                
                qString = "UPDATE TimeSheets SET ApprovalStatus='Approved' WHERE Name LIKE '%" + empName + "%'";
                break;
            }
            case (intentName == "hcm_timesheet_approval_reject"):{    
                empName = req.body.result.contexts[0].parameters['Name'];
                console.log("empName : " + empName);
                
                qString = "UPDATE TimeSheets SET ApprovalStatus='Rejected' WHERE Name LIKE '%" + empName + "%'";
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
                        
                        speech = "Your timesheet booking is pending for the following dates:";
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
                        
                    case (intentName == "hcm_timesheet_my_fill_these" || intentName == "hcm_timesheet_my_fill_more"):{
                        var array = req.body.result.contexts;
                        for( var key in array ){
                            console.log("**************************\narray "+ key +" : " + JSON.stringify(array[key]));
                            if( array[key].name == "tmdates"){
                                tmdates = array[key].parameters["tmdates"];
                                break;
                            } 
                        }
                        var emailBody = "<style>table{font-family:arial,sans-serif;border-collapse:collapse;width:60%}td,th{border:1px solid #dddddd;text-align:center;padding:8px}tr:nth-child(even){background-color:#dddddd}</style>" +
                                "<p><b>Hello Gokul,</b></p>" +
                            "<p>Kaaman Agarwal has sent the following timesheet entries for your approval:</p>" +
                            "<p><table ><tr><th>Date</th><th>Task</th><th>Hours</th></tr>";
                        for(var j=0; j< tmdates.length; j++){
                            emailBody = emailBody + '<tr><td>'+tmdates[j]+'</td><td>'+task+'</td><td>'+hours+'</td></tr>';
                        }
                        emailBody = emailBody + '</table></p><p>Thanks,<br><b>Viki</b></p>';
                        
//                            '<p><b>Hello Rhea,</b></p>' +
//                            '<p>Kaaman Agarwal has sent the following timesheet entries for you approval:</p><p>';
//                        for(var j=0; j< tmdates.length; j++){
//                            emailBody = emailBody + ''+  +', Task : ' + task +', Hours : ' + hours + '; ';
//                        }
//                        emailBody = emailBody + '</p><p>Thanks,<br><b>Viki</b></p>';
//                        
                        emailContent = {};
                        emailContent.speech = "Your timesheet booking has been sent to Rhea for approval.";
                        emailContent.subject = "Timesheet sent for your approval";
                        emailContent.body =  emailBody;
                        
                        console.log("email body :" + emailBody);

                        SendEmail( emailContent, req, res, function(result) {
                            console.log("SendEmail Called");
                        });
                        break;
                    }
                    case (intentName == "hcm_timesheet_approval"):{
                        speech = "There are following timesheet entries awaiting your approval:";
                        var currEmp = "",count=1;;
                        for(var i=0;i < result.recordset.length; i++){
                            if( currEmp != result.recordset[i].EmployeeName ){
                                currEmp = result.recordset[i].EmployeeName;
                                speech = speech + "\n" + count++ + ": " + result.recordset[i].EmployeeName + "\n" ;
                            }
                            speech = speech + "\n-"+ result.recordset[i].Date.toISOString().split("T")[0] + "-" + result.recordset[i].Hours + "-" + result.recordset[i].Task;
                        }
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                        break;
                    }
                        case (intentName == "hcm_timesheet_approval_approve"):{    
                        if( result.rowsAffected[0] > 0 ){
                            emailContent = {};
                            emailContent.speech = toTitleCase(empName) + "'s timesheet has been approved";
                            emailContent.subject = "Timesheet Entry has been approved";
                            emailContent.body = '<p><b>Hello ' + toTitleCase(empName) +',</b></p>' +
                                '<p>Your timesheet entry has been approved.</p>' +
                                '<p>Thanks,<br><b>Viki</b></p>';

                            SendEmail( emailContent, req, res, function(result) {
                                console.log("SendEmail Called");
                            });
                        }
                        break;
                    }
                    case (intentName == "hcm_timesheet_approval_reject"):{    
                        if( result.rowsAffected[0] > 0 ){
                            speech = toTitleCase(empName) + "'s timesheet has been rejected";
                            emailContent = {};
                            emailContent.speech = toTitleCase(empName) + "'s timesheet has been rejected";
                            emailContent.subject = "Timesheet Entry has been rejected";
                            emailContent.body = '<p><b>Hello ' + toTitleCase(empName) +',</b></p>' +
                                '<p>Your timesheet entry has been rejected.</p>' +
                                '<p>Thanks,<br><b>Viki</b></p>';

                            SendEmail( emailContent, req, res, function(result) {
                                console.log("SendEmail Called");
                            });
                        }
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
