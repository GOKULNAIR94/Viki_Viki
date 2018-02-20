module.exports = function ( qString, body, req, resp, callback){ 
    var http = require("https");
    console.log( "qString : " + qString);
    var http = require("http");

    var options = {
      "method": "POST",
      "hostname": "kaamanagarwal.ddns.net",
      "port": "9001",
      "path": "/HyperionPlanning/rest/11.1.2.4/applications/vision/dataexport/plantypes/Plan1",
      "headers": {
        "authorization": "Basic d2VibG9naWM6QWRtaW4xMjM=",
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
//          try{
//              console.log("Body : " + responseString);
//              resObj = JSON.parse(responseString);
//              callback( resObj );
//          }
//          catch(e){
//              resp.json({
//                message : "Error: " + e 
//            });
//          }
      });
    });

    req.write(body);
    req.end();
}
