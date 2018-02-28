module.exports = function(req, res, callback) {
    
    var QueryDB = require("./queryDB");
    var SendResponse = require("./sendResponse");
    
    var intentName = req.body.result.metadata.intentName;
    
    var qString = "";
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "",firstName="",lastName="";
    
    
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
                qString = "Select * from LeavesTable WHERE ApprovalStatus='Pending'";
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
            
            
    }
    

    QueryDB( qString, req, res, function(result) {
        if( result.recordset.length == 0){
            speech = "No records found.";
        }else{
            switch (true) {
                case (intentName == "hcm_leave_accruals"):
                {
                    speech = firstName + " has " + result.recordset[0].CasualLeaves + " Casual leaves and " + result.recordset[0].SickLeaves + " Sick leaves left."
                    break;
                }
                case (intentName == "hcm_leave_approval"):{
                    speech = "There are the " + result.recordset.length + " leave requests pending your approval:";
                    for(var i=0;i < result.recordset.length; i++){
                        if( result.recordset[i].Date != null ){
                            speech = speech + "\n" + (i+1) + ": " + result.recordset[i].Name + " needs leave on " + result.recordset[i].Date.toISOString().split("T")[0] + ".";
                            if( result.recordset[i].Reason != null ){
                                speech = speech + " Reason : " + result.recordset[i].Reason + ".";
                            }
                        }
                    }
                    break;
                }
                case (intentName == "hcm_leave_approval_approve"):{    
                    if( result.rowsAffected[0] > 0 ){
                        speech = empName + "'s leave has been approved";
                    }
                    break;
                }
                case (intentName == "hcm_leave_approval_reject"):{    
                    if( result.rowsAffected[0] > 0 ){
                        speech = empName + "'s leave has been rejected";
                    }
                    break;
                }
            }
            
        }
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
    
    
    
}
