module.exports = function ( qString, body, req, resp, callback){ 
    var http = require("https");
    console.log( "qString : " + qString);
    var options = {
      "method": "POST",
      "hostname": "kaamanagarwal.ddns.net",
      "port": "9001",
      "path": qString,
      "headers": {
        "authorization": "Basic d2VibG9naWM6QWRtaW4xMjM=",
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
              console.log("Body : " + responseString);
              resObj = JSON.parse(responseString);
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
    
    req.write(body);
    req.end();
}
