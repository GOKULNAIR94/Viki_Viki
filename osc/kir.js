module.exports = function(req, res ) {
    var Query = require("./query");
    
    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    var loginEncoded = "";
    var speech = "";
    var suggests = [];
    
    if ( intentName == "KIR_Partners" ) {
        
        qString = "/salesApi/resources/latest/partners?onlyData=true";
        
        Query( qString, loginEncoded, req, res, function(result) {
            if( result.items.length <= 0 ){
                speech = "No records found";
            }
            else{
                for(var i = 0; i < result.items.length; i++){
                    speech = speech + " " + (i+1) + ". " + result.items[i].OrganizationName + ".\n";
                    suggests.push({
                        "title": result.items[i].ActivityNumber
                    })

                }  
            }
            console.log(" speech : " + speech);
            
            if (req.body.originalRequest.source == "google") {
                res.json({
                    speech: speech,
                    displayText: speech,
                    //contextOut : [{"name":"oppty-followup","lifespan":5,"parameters":{"objType":"activities"}}],
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
            }else{
                res.json({
                    speech: speech,
                    displayText: speech
                });
            }
        });
        
    }
}
