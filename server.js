'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var jsonQuery = require('json-query');


var Market = '';
var Period = '';
var dateperiod = '';
var Month = '';

var speech = '';

restService.post('/inputmsg', function(req, res) {

    var intentName = req.body.result.metadata.intentName;
    Market = req.body.result.parameters.Market;
    Period = req.body.result.parameters.Period;
    dateperiod = req.body.result.parameters.dateperiod;
    Month = dateperiod.split("/")[1];

    console.log( "intentName : " + intentName );
    console.log( "Market : " + Market );
    console.log( "Period : " + Period );
    console.log( "dateperiod : " + dateperiod );
    console.log( "Month : " + Month );

    var content;
    try
    {
      if(intentName == 'Budget' ){
        content = fs.readFileSync('data.json', 'utf8');
        console.log( "Content : " + content);
        content = JSON.parse(content);
        var query = "Market=" + Market + " & Period=" + Period + "& Month=" + Month;
        console.log( "query : " + query );
        var output =
          jsonQuery('items[* '+ query +']["Remaining Budget"]', {
            data: content
          }).value;
          if( output.length == 1 ){
            console.log( "Output : " + output);
            speech = "The remaining YTD Budget for Entertainment is " + output + "$. Is there anything else I can help you with?"
          }
          if( output.length > 1 )
          {
            var sum = 0;
            for(var i =0; i < output.length; i++)
            {
              sum = sum + parseFloat(output[i]);
            }
            console.log( "Sum : " + sum);
            speech = "The remaining YTD Budget for Entertainment is " + sum + "$. Is there anything else I can help you with?"
          }
          return res.json({
              speech: speech,
              displayText: speech,
              //source: 'webhook-OSC-oppty'
          })
      }

      // if(intentName == 'WriteCSV' ){
      //   content = fs.readFileSync('data.json', 'utf8');
      //   console.log( "Content : " + content);
      //   content = JSON.parse(content);
      //   content.items[0]["Location"] = "Mahape";
      //   content.items[0]["cadre"] = "A12";
      //   content = JSON.stringify( content, null, 2);
      //   fs.writeFile('data.json', content, function(){
      //     console.log("All set...");
      //   });
      // }
       
    }
    catch(e)
    {
        console.log("Error : " + e );
    }

});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
