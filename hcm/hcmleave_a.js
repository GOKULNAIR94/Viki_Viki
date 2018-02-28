module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    
    var sql = require("mssql");
    var sqlConfig = {
        user: 'viki',
        password: 'Oracle123',
        server: 'vikisql.c1abev5luwmn.us-west-1.rds.amazonaws.com',
        database: 'viki'
    }
    
    var speech = "";
    var suggests = [];
    var contextOut = [];

    var empName = "";
    empName = req.body.result.contexts[0].parameters['Name'];
    console.log("empName : " + empName);
    var firstName = toTitleCase(empName.split(" ")[0].toLowerCase());
    var lastName = toTitleCase(empName.split(" ")[1].toLowerCase()) ;
    
    console.log("Name : " + firstName + " " + lastName );
    
    sql.connect(sqlConfig, function(err) {
        var request = new sql.Request();
        request.query('Select * from TimeSheets', function(err, recordset) {
            if (err) console.log(err);

            console.log(recordset); // Result in JSON format
        });
    });

    SendResponse(speech, suggests, contextOut, req, res, function() {
        console.log("Finished!");
    });
    
}
