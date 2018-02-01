module.exports = function ( req, res, callback){ 
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var loginEncoded="", qString="";
    var speech="";
    var suggests = [];
    var intentName = req.body.result.metadata.intentName;
    var qString="";

    
    if( intentName == "KIR_Partners" ){
        
        qString = "/salesApi/resources/latest/partners?onlyData=true";
        Query( qString, loginEncoded, req, res, function(result) {
            if( result.items.length <= 0 ){
                speech = "No records found";
            }
            else{
                for(var i = 0; i < result.items.length; i++){
                    speech = speech + " " + (i+1) + ". " + result.items[i].OrganizationName + ".\n";
                    suggests.push({
                        "title": result.items[i].OrganizationName
                    })

                }  
                speech = speech + "Select Partner to get list of associated Opportunities: "; 
            }
            SendResponse( speech, suggests, req, res, function(){
                console.log("Finished!");
            });

        });
    }
    else{
        if( intentName == "KIR_Partners_opty" ){
            var partnerName = req.body.result.contexts[0].parameters["partnerName.original"];
            qString = "/salesApi/resources/latest/opportunities?onlyData=true&q=PrimaryPartnerOrgPartyName="+ encodeURIComponent(partnerName);
            
            Query( qString, loginEncoded, req, res, function(result) {
                if( result.items.length <= 0 ){
                    speech = "No records found";
                }
                else{
                    for(var i = 0; i < result.items.length; i++){
                        speech = speech + " " + (i+1) + ". " + result.items[i].Name + ".\n";
                        suggests.push({
                            "title": result.items[i].Name
                        })

                    }
                    speech = speech + "Select Opportunities for Quote: ";
                }
                SendResponse( speech, suggests, req, res, function(){
                    console.log("Finished!");
                });
            });
        }
        else{
            if( intentName == "KIR_Partners_opty_quote" ){
                var optyName = req.body.result.contexts[0].parameters["optyName.original"];
                qString = "salesApi/resources/latest/Quote_c?q=OpportunityName_c="+ encodeURIComponent(optyName);

                Query( qString, loginEncoded, req, res, function(result) {
                    if( result.items.length <= 0 ){
                        speech = "No records found";
                    }
                    else{
                        for(var i = 0; i < result.items.length; i++){
                            speech = speech + " " + (i+1) + ". " + result.items[i].Name + ".\n";
                            suggests.push({
                                "title": result.items[i].Name
                            })

                        }
                        speech = speech + "Select Quate for Order: ";
                    }
                    SendResponse( speech, suggests, req, res, function(){
                        console.log("Finished!");
                    });
                });
            }
        }
    }

    
    
}
