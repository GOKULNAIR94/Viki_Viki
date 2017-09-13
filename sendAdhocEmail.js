module.exports = function(req, res) {
    const express = require('express');
    const bunyan = require('bunyan');
    const nodemailer = require('nodemailer');
    const restService = express();
    const bodyParser = require('body-parser');
    var fs = require('fs');
var intent_name = req.body.result.metadata.intentName;
        console.log(intent_name);
        console.log("Inside");
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
     service: 'Outlook365', // no need to set host or port etc.
     auth: {
         user: 'reachme@kaaman.onmicrosoft.com',
         pass: 'K@agar55wal'
     }
        });
        
        
        var to_email = "Gokul.Nair@lntinfotech.com"; // "Kaaman.agarwal@lntinfotech.com";
        var targetApp = req.body.result.parameters.targetApp;
        var sourceApp = req.body.result.parameters.sourceApp;
        var scenario = req.body.result.parameters.scenario;
    
    
    
        var speech = "Jobs has been triggered to push the data for the current year FY17 from "+ sourceApp + " to " + targetApp + " for the Scenario " + scenario + ". This is the job ID JB76278124. You will receive a data push completion email in approx 10 mins.";
        
        console.log(speech);
        console.log('SMTP Configured');
        
        let message = {
                    from:'VIKI <reachme@kaaman.onmicrosoft.com>',
                    // Comma separated list of recipients
                    to: to_email,

                    // Subject of the message
                    subject: 'Adhoc Data push completion notification!', //

                    // HTML body
                    html: '<p><b>Hello Kaaman,</b></p>' +
                        '<p>Adhoc Data Push from '+ sourceApp + ' to ' + targetApp + ' for the ' + scenario + ' scenario is completed.</p>' + 
                        '<p>Thanks,<br><b>Viki</b></p>',

                    // Apple Watch specific HTML body
                    watchHtml: '<b>Hello</b> to myself'

                };

                transporter.verify(function(error, success) {
                   if (error) {
                        console.log(error);
                   } else {
                        console.log('Server is ready to take our messages');
                   }
                });

                console.log('Sending Mail');
        setTimeout(function(){    
                    transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log('Error occurred');
                        console.log(error.message);
                        return;
                    }
                    console.log('Message sent successfully!');
                    console.log('Server responded with "%s"', info.response);
                    transporter.close();
                });
                        return res.json
                        ({
                            speech: speech ,
                            displayText: speech,
                            source: 'webhook-OSC-oppty'
                        });
                }, 5000);  

}
