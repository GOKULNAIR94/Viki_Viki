module.exports = function ( req, res, callback){ 
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var loginEncoded="", qString="";
    var speech="";
    var suggests = [{"title": "Show me Opportunities"}];
    var suggPatners = [];
    var intentName = req.body.result.metadata.intentName;
    
    qString = "/salesApi/resources/latest/partners?onlyData=true";
        
    Query( qString, loginEncoded, req, res, function(result) {
        
        if( intentName == "KIR_Partners" ){
            if( result.items.length <= 0 ){
                speech = "No records found";
            }
            else{
                for(var i = 0; i < result.items.length; i++){
                    speech = speech + " " + (i+1) + ". " + result.items[i].OrganizationName + ".\n";
                    suggPatners.push({
                        "title": result.items[i].OrganizationName
                    })

                }  
            }
            SendResponse( speech, suggests, req, res, function(){
                console.log("Finished!");
            });
        }
        else{
            if( intentName == "KIR_Partners_opty" ){
                SendResponse( speech, suggPatners, req, res, function(){
                    console.log("Finished!");
                });
                
            }
        }
        
            

    });

    
    
}
