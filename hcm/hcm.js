module.exports = function(req, res, callback) {
    var HCMwho = require("./hcmwho");
    
    var intentName = req.body.result.metadata.intentName;
    
    switch (true) {
            case (intentName == "hcm_whois"):
            {
                HCMwho(req, res, function(result) {
                    console.log("HCM who Called");
                });
                break;
            }
            case (intentName == "hcm_getone"):
            {
                HCMwho(req, res, function(result) {
                    console.log("HCM Called");
                });
                break;
            }
    }
    
}
