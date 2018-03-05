module.exports = function ( qString, body, req, resp, callback){ 
    console.log( "qString : " + qString);
    var http = require("http");

    var options = {
      "method": "POST",
      "hostname": "planning-a17894.pbcs.ap1.oraclecloud.com",//"hostname": "kaamanagarwal.ddns.net",
//      "port": "9001",
      "path": qString, //"/HyperionPlanning/rest/11.1.2.4/applications/vision/dataexport/plantypes/Plan1",
      "headers": {
        "authorization": "Basic d2VibG9naWM6QWRtaW4xMjM=",
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [],resObj;

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
          try{
              var body = Buffer.concat(chunks);
              console.log(body.toString());
              resObj = JSON.parse(body.toString());
              callback( resObj );
          }
          catch(e){
              resp.json({
                message : "Error: " + e 
            });
          }
      });
    });

    req.write(body.toString());
    req.end();
}
