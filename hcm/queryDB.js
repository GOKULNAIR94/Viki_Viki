module.exports = function ( qString, req, resp, callback){
    
    var sql = require("mssql");
    var sqlConfig = {
        user: 'viki',
        password: 'Oracle123',
        server: 'vikisql.c1abev5luwmn.us-west-1.rds.amazonaws.com',
        database: 'viki'
    }
    
    sql.connect(sqlConfig, function(err) {
        var request = new sql.Request();
        request.query( qString, function(err, output) {
            if (err){ 
                console.log(err);
                sql.close();
                resp.json({
                    message : "Unable to process your request. Please try again later."
                });
            }
            else{
                console.log(output.recordset); // Result in JSON format
                sql.close();
                callback( output );
            } 
        });
    });
}
