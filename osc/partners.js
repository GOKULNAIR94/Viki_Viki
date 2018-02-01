module.exports = function ( req, res, callback){ 
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var loginEncoded="", qString="";
    var speech="";
    var suggests = [];
    var intentName = req.body.result.metadata.intentName;
    

    qString = "/salesApi/resources/latest/partners?onlyData=true";
    if( intentName == "KIR_Partners" ){
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
            }
            SendResponse( speech, suggests, req, res, function(){
                console.log("Finished!");
            });

        });
    }
    else{
        if( intentName == "KIR_Partners_opty" ){
            var partnerName = req.body.result.parameters.partnerName;
            qString = "salesApi/resources/latest/opportunities?onlyData=true&q=PrimaryPartnerOrgPartyName='"+ partnerName +"'";
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
                }
                SendResponse( speech, suggests, req, res, function(){
                    console.log("Finished!");
                });
            });
        }
    }

    
    
}
