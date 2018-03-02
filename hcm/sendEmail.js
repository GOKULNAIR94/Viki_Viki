module.exports = function( emailContent, req, res) {
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


    var toemail = "kaaman.agarwal@lntinfotech.com";
    var speech = emailContent.speech;
    var body = emailContent.body;
    var subject = emailContent.subject;

    console.log(speech);
    console.log('SMTP Configured');

    let message = {
        from: 'VIKI <reachme@kaaman.onmicrosoft.com>',
        // Comma separated list of recipients
        to: toemail,

        bcc: "Gokul.Nair@lntinfotech.com",

        // Subject of the message
        subject: subject, //

        // HTML body
        html: body,

        // Apple Watch specific HTML body
        watchHtml: '<b>Hello</b> to myself'

    };

    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
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
        }
    });
    
    console.log('Sending Mail');
    setTimeout(function() {
//        transporter.sendMail(message, (error, info) => {
//            if (error) {
//                console.log('Error occurred');
//                console.log(error.message);
//                return;
//            }
//            console.log('Message sent successfully!');
//            console.log('Server responded with "%s"', info.response);
//            transporter.close();
//        });
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'webhook-OSC-oppty'
        });
    }, 4000);

}