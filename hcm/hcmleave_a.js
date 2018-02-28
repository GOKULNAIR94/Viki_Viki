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
    
    qString = "Select * from Employee WHERE FirstName='"+ firstName +"' AND LastName='" + lastName + "'";

    QueryDB( qString, req, res, function(result) {
        speech = firstName + " has " + result[0].CasualLeaves + " Casual leaves and " + result[0].SickLeaves + " Sick leaves left."
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
    
    
    
}
