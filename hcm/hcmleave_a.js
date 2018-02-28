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

    speech = speech + "Name : " + firstName + " " + lastName ;

    SendResponse(speech, suggests, contextOut, req, res, function() {
        console.log("Finished!");
    });
    
}
