module.exports = function(req, res, callback) {
    var HCMwho = require("./hcmwho");
    var HCMget = require("./hcm_get");
    var HCMhire = require("./hcmhire");
    
    var intentName = req.body.result.metadata.intentName;
    
    switch (true) {
            case (intentName == "hcm_whois"):
            {
                HCMwho(req, res, function(result) {
                    console.log("HCM who Called");
                });
                break;
            }
            case (intentName == "hcm_hire"):
            {
                HCMhire(req, res, function(result) {
                    console.log("HCM who Called");
                });
                break;
            }
            case (intentName.indexOf( "hcm_get_one" ) == 0 ):
            {
                HCMget(req, res, function(result) {
                    console.log("HCM Called");
                });
                break;
            }
    }
    
}
