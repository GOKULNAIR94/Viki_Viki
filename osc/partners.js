module.exports = function ( req, res, callback){ 
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var loginEncoded="", qString="";
    var speech="";
    var suggests = {};
    

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
            }
            SendResponse( speech, suggests, function(){
                console.log("Finished!");
            });
            
        });
    
}
