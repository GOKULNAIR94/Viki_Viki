module.exports = function( emailContent, req, res) {
    const express = require('express');
    const bunyan = require('bunyan');
    const nodemailer = require('nodemailer');
    const restService = express();
    const bodyParser = require('body-parser');
    var fs = require('fs');
    var intentName = req.body.result.metadata.intentName;
    console.log( "Intent : " + intentName );
    console.log("Inside");
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        service: 'Outlook365', // no need to set host or port etc.
        auth: {
            user: req.body.headers.emailuser, 
            pass: req.body.headers.emailpw 
        }
    });
    var to_email = "gokul.nair@lntinfotech.com"; 

    var speech = emailContent.speech;
    var file = emailContent.file;
    var body = emailContent.body;
    var subject = emailContent.subject;
    
    console.log(speech);
    console.log('SMTP Configured');
    fs.readFile("./" + file, function(err, data) {
        // Message object
        let message = {
            from: 'VIKI <viki@kaaman.onmicrosoft.com>',
            // Comma separated list of recipients
            to: to_email,

            // Subject of the message
            subject: subject, //

            // HTML body
            html: body,

            // Apple Watch specific HTML body
            watchHtml: '<b>Hello</b> to myself',

            //An array of attachments
            attachments: [{
                'filename': file,
                'content': data
            }]

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
    return res.json({
        speech: speech,
        displayText: speech
    });


}