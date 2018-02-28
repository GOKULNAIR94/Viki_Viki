module.exports = function(req, res, callback) {
    var HCMwho = require("./hcmwho");
    
    HCMwho(req, res, function(result) {
        console.log("HCM Called");
    });
}
