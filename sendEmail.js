module.exports = function(req, res) {
    const express = require('express');
    const bunyan = require('bunyan');
    const nodemailer = require('nodemailer');
    const restService = express();
    const bodyParser = require('body-parser');
    var fs = require('fs');
var intentName = req.body.result.metadata.intentName;
        console.log(intentName);
        console.log("Inside");
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
     service: 'Outlook365', // no need to set host or port etc.
     auth: {
         user: 'reachme@kaaman.onmicrosoft.com',
         pass: 'K@agar55wal'
     }
        });
    
    if(intentName == 'ADS_HyperionReport' ){
        var to_email = req.body.result.parameters.emailaddress;
        var reportName = req.body.result.parameters.reportName;
        var chartfield = req.body.result.parameters.chartfield;
        var yearName = req.body.result.parameters.reportYear;
        var scenario = req.body.result.parameters.reportScenario;
        var sourceApp = req.body.result.parameters.sourceApp;
        var version = req.body.result.parameters.version;
        var currency = req.body.result.parameters["currency-name"];
    var projects = req.body.result.parameters["projects"];
    
    
    
        var speech = 'Report : ' + reportName + ' for ' + projects +' - ' + chartfield + ' (' + yearName +') has been emailed to '+ to_email +'. Please give a few minutes for the email to arrive in your inbox. Is there anything else I can help you with?';
        
        console.log(speech);
        console.log('SMTP Configured');
        fs.readFile("./DepartmentalExpenses_Corporate_Report.pdf", function (err, data) {
                // Message object
                let message = {
                    from:'VIKI <reachme@kaaman.onmicrosoft.com>',
                    // Comma separated list of recipients
                    to: to_email,

                    // Subject of the message
                    subject: 'Departmental Expenses Corporate Report', //

                    // HTML body
                    html: '<p><b>Hello Kaaman,</b></p>' +
                        '<p>Attached is the Departmental Expenses Corporate Report as Requested.</p>' + 
                        '<p>Thanks,<br><b>Viki</b></p>',

                    // Apple Watch specific HTML body
                    watchHtml: '<b>Hello</b> to myself',

                    //An array of attachments
                    attachments: 
                    [{'filename': 'DepartmentalExpenses_Corporate_Report.pdf', 'content': data}]

                };

                transporter.verify(function(error, success) {
                   if (error) {
                        console.log(error);
                   } else {
                        console.log('Server is ready to take our messages');
                   }
                });

                console.log('Sending Mail');
                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log('Error occurred');
                        console.log(error.message);
                        return;
                    }
                    console.log('Message sent successfully!');
                    console.log('Server responded with "%s"', info.response);
                    transporter.close();
                })
        });
                        return res.json
                        ({
                            speech: speech ,
                            displayText: speech,
                            source: 'webhook-OSC-oppty'
                        });
      }
    
    
    
    if(intentName == 'ADS_AdhocData' ){
        
        var to_email =  "Gokul.nair@lntinfotech.com"; // "Kaaman.agarwal@lntinfotech.com";
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
      }
    
}
