module.exports = function ( qString, req, resp, callback){ 
    var http = require("https");
    console.log( "qString : " + qString);

    var options = {
      "method": "GET",
      "hostname": "hcm-aufsn4x0cma.oracleoutsourcing.com",
      "port": null,
      "path": qString, //"/hcmCoreApi/resources/11.12.1.0/emps?q=HireDate%3E2008-02-26%20and%20%3C2008-04-26&onlyData=true",
      "headers": {
        "authorization": "Basic S2FhbWFuLkFnYXJ3YWw6T3JhY2xlMTIz",
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function (res) {
      var responseString = '',
            resObj;

      res.on("data", function ( data ) {
        responseString += data;
      });

      res.on("end", function () {
          try{
              resObj = JSON.parse(responseString);
              if( resObj.items != null ){
                  var rowCount = resObj.items.length;
                  console.log( "rowCount : " + rowCount);  
              }
              callback( resObj );
          }
          catch(e){
              resp.json({
                message : "Error: " + e 
            });
          }
      });
    res.on("error", function ( e ) {
        resp.json({
                message : "Error: " + e 
            });
      });
    });

    req.end();
}
