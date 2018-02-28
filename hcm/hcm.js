module.exports = function(req, res, callback) {
    var HCMwho = require("./hcmwho");
    
    var intentName = req.body.result.metadata.intentName;
    
    
    HCMwho(req, res, function(result) {
        console.log("HCM Called");
    });
}
