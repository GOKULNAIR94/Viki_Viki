module.exports = function(req, resp) {
    
    var Query = require("./query");

    
    var speech = "";
    var intentName = req.body.result.metadata.intentName;

    var os = require('os');
    var qPriotity;
    
    var qPath ="";
    
    if ( intentName == "ADS_SNIncidents_list") {
        
        qPriotity = req.body.result.parameters['ADS_RN_Priority'];
        console.log("qPriotity : " + qPriotity);
        
        if( qPriotity == "open"){
            qPath = "/services/rest/connect/latest/incidents?fields=subject&q=statusWithType.status.lookupName='Unresolved'";
        }
        else{
            if( qPriotity == "closed"){
                qPath = "/services/rest/connect/latest/incidents?fields=subject&q=statusWithType.status.lookupName='Solved'";
            }
            else{
                qPath = "/services/rest/connect/latest/incidents?fields=subject&q=customFields.c.priority.lookupName='" + encodeURIComponent(qPriotity) + "'%20AND%20statusWithType.status.lookupName='Unresolved'";
            }
        }
        console.log("List intentName : " + intentName);
        console.log("qPath : " + qPath);
        var suggests = [];
        Query( qPath, req, resp, function( output ){
            for(var i = 0; i < output.items.length; i++){
                speech = speech + "Incident " + output.items[i].lookupName + ": " + output.items[i].subject + ". " + os.EOL;
                if ( output.items[i].lookupName != null &&  output.items[i].lookupName != "") {
                    suggests.push({
                        "title": "Incident " + output.items[i].lookupName
                    })
                }
            }
            resp.json({
                speech: speech,
                displayText: speech,
                data: {
                    google: {
                        'expectUserResponse': true,
                        'isSsml': false,
                        'noInputPrompts': [],
                        'richResponse': {
                            'items': [{
                                'simpleResponse': {
                                    'textToSpeech': speech,
                                    'displayText': speech
                                }
                            }],
                            "suggestions": suggests
                        }
                    }
                }
            });
//            resp.json({
//                speech: speech,
//                displayText: speech,
//                //source: 'webhook-OSC-oppty'
//            });
        });
        
    }


    if (intentName == "ADS_SNIncident" || intentName == "ADS_SNIncidents_list - custom") {
        //attrib = req.body.result.parameters['ADS_attrib'];

        var number = req.body.result.parameters['Number'];
        qPath = "/services/rest/connect/latest/incidents?fields=subject&q=lookupName='"+ number +"'"
        Query( qPath, req, resp, function( result ){
            if( result.items.length > 0 ){
                qPath = "/services/rest/connect/latest/incidents/" + result.items[0].id;
                Query( qPath, req, resp, function( output ){
                    var incDesc = output.customFields.c.description;
                    var incPrior = output.customFields.c.priority.lookupName;
                    var incStatus = output.statusWithType.status.lookupName;
                    var incSubject = output.subject;
                    
                    if ( incSubject != null && incSubject != "")
                        speech = speech + "Subject : " + incSubject + "." + os.EOL;

                    if ( incStatus != null && incStatus != "")
                        speech = speech + "Status : " + incStatus + "." + os.EOL;

                    if ( incPrior != null && incPrior != "")
                        speech = speech + "Priority : " + incPrior + "." + os.EOL;

                    if ( incDesc != null && incDesc != "")
                        speech = speech + "Notes : " + incDesc + "." + os.EOL;
                    
                    resp.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    });
                });
            }
            else{
                //console.log( "combObj 2: " + JSON.stringify(combObj) );
                speech = "No records found! Please check the Incident Number and try again!"
                resp.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                });
            }

        });

    }
}