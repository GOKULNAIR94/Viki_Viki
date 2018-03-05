module.exports = function ( qString, body, req, resp, callback){ 
    var http = require("https");
    
    console.log( "qString : " + qString);
    console.log( "body : " + JSON.stringify(body));
    

    var options = {
      "method": "POST",
      "hostname": "planning-a17894.pbcs.ap1.oraclecloud.com",//"hostname": "kaamanagarwal.ddns.net",
//      "port": "9001",
      "path": qString, //"/HyperionPlanning/rest/11.1.2.4/applications/vision/dataexport/plantypes/Plan1",
      "headers": {
        "authorization": "Basic YTE3ODk0LmJodW1pa2Euc2hpdmFsaUBsbnRpbmZvdGVjaC5jb206RGVjQDIwMTc=",
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [],resObj ={};

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
          try{
              var result = Buffer.concat(chunks);
              console.log(result.toString());
              resObj = JSON.parse(result.toString());
              callback( resObj );
          }
          catch(e){
              console.log("Error: " + e  );
              resp.json({
                speech: "Unble to process your request. Please try again later."
            });
          }
      });
    });

    req.write(JSON.stringify(body));
    req.end();
}
