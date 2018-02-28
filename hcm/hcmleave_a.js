module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var QueryDB = require("./queryDB");

    var SendResponse = require("./sendResponse");
    
    var qString = "";
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "";
    empName = req.body.result.contexts[0].parameters['Name'];
    console.log("empName : " + empName);
    var firstName = toTitleCase(empName.split(" ")[0].toLowerCase());
    var lastName = toTitleCase(empName.split(" ")[1].toLowerCase()) ;
    
    console.log("Name : " + firstName + " " + lastName );
    
    
    switch (true) {
            case (intentName == "hcm_leave_accruals"):{
                qString = "Select * from Employee WHERE FirstName='"+ firstName +"' AND LastName='" + lastName + "'";
                break;
            }

            case (intentName == "hcm_leave_approval"):{
                qString = "Select * from LeavesTable WHERE ApprovalStatus='N'";
                break;
            }
    }
    

    QueryDB( qString, req, res, function(result) {
        if( result.length == 0){
            speech = "No records found.";
        }else{
            switch (true) {
            case (intentName == "hcm_leave_accruals"):
            {
                speech = firstName + " has " + result[0].CasualLeaves + " Casual leaves and " + result[0].SickLeaves + " Sick leaves left."
                break;
            }
            case (intentName == "hcm_leave_approval"):{
                speech = "There are the " + result.length + " leave requests pending your approval:";
                for(var i=0;i<=result.length; i++){
                    speech = "\n" + (i+1) + ": " + result[i].Name + "needs leave on " + result[i].Date + ". Reason : " + result[i].Reason + ".";
                }
                break;
            }
            
        }
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
    
    
    
}
