module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var Query = require("./query");
    var Update = require("./update");
    var SendResponse = require("./sendResponse");
    
    var SendEmail = require("./sendEmail");
    
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
    
    var qString = "/hcmCoreApi/resources/11.12.1.0/emps?q=FirstName=" + firstName + ";LastName=" + lastName;
    
    Query( qString, req, res, function(result) {
        if (result.items.length == 0) {
            speech = "No employee found by name " + empName + ".";
            SendResponse(speech, suggests, contextOut, req, res, function() {
                console.log("Finished!");
            });
        } else {
            console.log("Update : " + result.toString() );
            var empsId = result.items[0].links[0].href;
            console.log("href! : " + empsId );
            empsId = empsId.split("emps/")[1];
            console.log("empsId : " + empsId);
            qString = "/hcmCoreApi/resources/11.12.1.0/emps/" + empsId; //00020000000EACED00057708000110D9317FA60C0000004AACED00057372000D6A6176612E73716C2E4461746514FA46683F3566970200007872000E6A6176612E7574696C2E44617465686A81014B5974190300007870770800000161D9B5680078
            var attribValue = req.body.result.parameters['attribValue'];
            var body = {};
            body.City = attribValue;
             
            Update( qString, body, req, res, function() {
                console.log("Update called");
                var emailContent = {};
                emailContent.speech = firstName + " has been transferred to " + attribValue + ". \n Is there anything else I can assist you with?";
                emailContent.subject = "Your Transfer to " +attribValue+ " is processed";
                emailContent.body = '<p><b>Hello ' +firstName+',</b></p>' +
                    '<p>Your Transfer is processed. Please raise a request on IT Helpdesk for Domain Change.</p>' +
                    '<p>Thanks,<br><b>Viki</b></p>';

                SendEmail( emailContent, req, res, function(result) {
                    console.log("SendEmail Called");
                });
            });
        }
        
        
    });
    
}
