module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    var QueryDB = require("./queryDB");
    var SendResponse = require("./sendResponse");
    
    var intentName = req.body.result.metadata.intentName;
    
    var qString = "";
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "",firstName="",lastName="";
    var idDate = parseInt(Number(new Date())) % 1000;
    
    switch (true) {
            
            case (intentName == "hcm_leave_accruals"):{
                empName = "";
                empName = req.body.result.contexts[0].parameters['Name'];
                console.log("empName : " + empName);
                firstName = toTitleCase(empName.split(" ")[0].toLowerCase());
                lastName = toTitleCase(empName.split(" ")[1].toLowerCase()) ;
                console.log("Name : " + firstName + " " + lastName );
                
                qString = "Select * from Employee WHERE FirstName='"+ firstName +"' AND LastName='" + lastName + "'";
                break;
            }

            case (intentName == "hcm_leave_approval"):{
                qString = "SELECT Name, lcount=COUNT(ID), reason=MAX(Reason), date = substring((SELECT ( ',' + CONVERT(varchar, Date)) FROM LeavesTable t2 WHERE Name=t1.Name ORDER BY Date ASC FOR XML PATH( '' )), 2, 1000 )  FROM LeavesTable t1 WHERE ApprovalStatus='Pending' GROUP BY Name";
                break;
            }
            
            case (intentName == "hcm_leave_approval_approve"):{    
                empName = req.body.result.contexts[0].parameters['Name'];
                console.log("empName : " + empName);
                
                qString = "UPDATE LeavesTable SET ApprovalStatus='Approved' WHERE Name LIKE '%" + empName + "%'";
                break;
            }
            case (intentName == "hcm_leave_approval_reject"):{    
                empName = req.body.result.contexts[0].parameters['Name'];
                console.log("empName : " + empName);
                
                qString = "UPDATE LeavesTable SET ApprovalStatus='Rejected' WHERE Name LIKE '%" + empName + "%'";
                break;
            }
            case (intentName == "hcm_leave_apply_one" ):{    
                var leDate = req.body.result.contexts[0].parameters['date'];
                var leReason = req.body.result.contexts[0].parameters['reason'];
                console.log("leDate : " + leDate);
                console.log("reason : " + leReason);
                
                qString = "INSERT INTO LeavesTable ( ID, Date, Name, EmployeeID, ApproverID, Reason, ReasonCategory, ApprovalStatus) VALUES ( "+idDate+", '"+leDate+"' ,'Kaaman Agarwal',' 300000000000000','300000000000000','" +leReason+ "','Casual', 'Pending')";
                break;
            }
            case (intentName == "hcm_leave_apply_more" ):{    
                var leDates = req.body.result.contexts[0].parameters['date'];
                var lePeriod = req.body.result.contexts[0].parameters['dateperiod'];
                var leReason = req.body.result.contexts[0].parameters['reason'];
                console.log("leDates : " + leDates);
                console.log("lePeriod : " + lePeriod);
                console.log("reason : " + leReason);
                
                if( leDates != null){
                    qString = "INSERT INTO LeavesTable ( ID, Date, Name, EmployeeID, ApproverID, Reason, ReasonCategory, ApprovalStatus) VALUES ( "+idDate+", '" + leDates[0] + "' ,'Kaaman Agarwal',' 300000000000000','300000000000000','" + leReason + "','Casual', 'Pending')";
                    for(var d=0; d< leDates.length; d++){
                        qString = qString + ", ( "+(++idDate)+", '" + leDates[d] + "' ,'Kaaman Agarwal',' 300000000000000','300000000000000','" + leReason + "','Casual', 'Pending')"
                    }
                }else{
                    if( lePeriod != null){
                        var StartDate = lePeriod.split("/")[0];
                        var EndDate = lePeriod.split("/")[1];
                        var dDate = new Date(StartDate);
                        qString = "INSERT INTO LeavesTable ( ID, Date, Name, EmployeeID, ApproverID, Reason, ReasonCategory, ApprovalStatus) VALUES ( "+idDate+", '" + StartDate + "' ,'Kaaman Agarwal',' 300000000000000','300000000000000','" + leReason + "','Casual', 'Pending')";
                        var formatDate = "";
                        while( dDate <= new Date(EndDate)){
                            formatDate = dDate.getFullYear() + "-" + (dDate.getMonth()+1) + "-" + dDate.getDate();
                            qString = qString + ", ( "+ (++idDate) +", '" + formatDate + "' ,'Kaaman Agarwal',' 300000000000000','300000000000000','" + leReason + "','Casual', 'Pending')"
                            dDate.setDate(dDate.getDate() + 1);
                        }                        
                    }
                }
                    
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
                    case (intentName == "hcm_leave_accruals"):
                    {
                        speech = firstName + " has " + result.recordset[0].CasualLeaves + " Casual leaves and " + result.recordset[0].SickLeaves + " Sick leaves left."
                        break;
                    }
                    case (intentName == "hcm_leave_approval"):{
                        speech = "There are " + result.recordset.length + " leave requests pending your approval:";
                        for(var i=0;i < result.recordset.length; i++){
                            if( result.recordset[i].date != null ){
                                var arrDate = result.recordset[i].date.split(",");
                                if( arrDate.length == 1 ){
                                    speech = speech + "\n" + (i+1) + ": " + result.recordset[i].Name + " needs a leave on " + arrDate[0].split(" ")[0];
                                }else{
                                    speech = speech + "\n" + (i+1) + ": " + result.recordset[i].Name + " needs leaves for " + result.recordset[i].lcount + " days on";

                                    for(var j=0;j < arrDate.length; j++){
                                        speech = speech + " " + arrDate[j].split(" ")[0];
                                        if( j == arrDate.length - 2)
                                            speech = speech + " and ";
                                        else
                                            speech = speech + ", "
                                    }
                                }
                                if( result.recordset[i].reason != null ){
                                    speech = speech + " Reason : " + result.recordset[i].reason + ".";
                                }

                            }
                        }
                        break;
                    }
                    case (intentName == "hcm_leave_approval_approve"):{    
                        if( result.rowsAffected[0] > 0 ){
                            speech = toTitleCase(empName) + "'s leaves have been approved";
                        }
                        break;
                    }
                    case (intentName == "hcm_leave_approval_reject"):{    
                        if( result.rowsAffected[0] > 0 ){
                            speech = toTitleCase(empName) + "'s leaves have been rejected";
                        }
                        break;
                    }
                    case (intentName == "hcm_leave_apply_one" || intentName == "hcm_leave_apply_more" ):{    
                        if( result.rowsAffected[0] > 0 ){
                            speech = "Leave request: " + idDate +", submitted successfully";
                        }
                        break;
                    }
                }

            }
            SendResponse(speech, suggests, contextOut, req, res, function() {
                console.log("Finished!");
            });
        });
    }else{
        speech = "Unable to process your request. Please try again later."
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    }
    
    
    
}
