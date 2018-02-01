module.exports = function ( req, res, callback){ 
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var loginEncoded="", qString="";
    var speech="";
    var suggests = [{"title": "Show me Opportunities"}];
    var suggPatners = [];
    var intentName = req.body.result.metadata.intentName;
    for (var key in req){
        var value = req[key];
        console.log("BHaiii : " + key );//JSON.stringify(key)
      }
    
    
    qString = "/salesApi/resources/latest/partners?onlyData=true";
        console.log("intentName partenres.js :" + intentName);
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
                    });
                    var contextOut= [{"name":"KIR_Partners_opty","lifespan":5,"parameters":{"suggPatners":"suggPatners"}}];

                }  
            }
            SendResponse( speech, suggests, contextOut, req, res, function(){
                console.log("Finished!");
            });
        }
        else{
            if( intentName == "KIR_Partners_opty" ){
                speech="Select Partner:";
                console.log("KIR_Partners_opty! : suggPatners " + suggPatners);
                SendResponse( speech, suggPatners, contextOut, req, res, function(){
                    console.log("Finished!");
                });
                
            }
        }
        
            

    });

    
    
}
