module.exports = function(req, res, callback) {
    var HCMwho = require("./hcmwho");
    var HCMget = require("./hcm_get");
    var HCMhire = require("./hcmhire");
    var HCMleave_a = require("./hcmleave_a");
    var HCMtransfer = require("./hcm_transfer");
    var HCMAccess = require("./hcm_ppstAccess");
    var HCMtime = require("./hcm_timesheet");
    
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
            
            case (intentName.indexOf( "hcm_leave_" ) == 0 ):
            {
                HCMleave_a(req, res, function(result) {
                    console.log("HCMleave_a Called");
                });
                break;
            }
            case (intentName.indexOf( "hcm_transfer" ) == 0 ):
            {
                HCMtransfer(req, res, function(result) {
                    console.log("HCM_transfer Called");
                });
                break;
            }
            case (intentName == "hcm_Via-PSFTAccessAdd - yes" ):
            {
                HCMAccess(req, res, function(result) {
                    console.log("HCMAccess Called");
                });
                break;
            }
            
            case (intentName.indexOf( "hcm_timesheet" ) == 0 ):
            {
                HCMtime(req, res, function(result) {
                    console.log("HCMtime Called");
                });
                break;
            }
    }
    
}
