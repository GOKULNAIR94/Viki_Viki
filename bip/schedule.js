module.exports = function ( req, resp, callback){ 
    var soap = require('soap');
    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/v2/ScheduleService?wsdl';
//    var args = {
//        "reportRequest" : {
//            "reportAbsolutePath" : "Custom/BIPTest/Tickets.xdo"
//        },
//        "userID" : "LNT001",
//        "password" : "lntLNT2K16_1"
//    };
    
    var args = {
        bookBindingOutputOption : "FALSE",
        dataModelUrl :"/Custom/BIPTest/TestDS.xdm",
        endDate :"2018-03-10",   
        mergeOutputOption : "FALSE",  
        notificationTo :"gokul.nair@lntinfotech.com",
        notificationUserName :"LNT001",
        notifyWhenFailed :"TRUE",
        notifyWhenSkipped :"TRUE",
        notifyWhenSuccess :"TRUE",
        notifyWhenWarning :"TRUE",    
        repeatCount :"0",
        repeatInterval :"0",
        saveDataOption :"TRUE",
        saveOutputOption :"TRUE",
        scheduleBurstringOption :"FALSE",
        scheduleBurstingOption :"FALSE",
        schedulePublicOption :"TRUE",
        startDate :"2016-01-29",
        useUTF8Option :"TRUE",
        userJobDesc :"My Template Test",
        userJobName :"MyJob1111",
        deliveryChannels:
        {
          emailOptions:
          [{
            item:
            {

              emailBody :"Hello,\nSending you the report in the pdf format\n\nThanks and regards,\nOSC Team\n\n",

              emailFrom :"gokul.nair@lntinfotech.com",
              emailReplyTo :"NA",
              emailServerName :"DefaultEmail",
              emailSubject :"Opty Report",
              emailTo :"gokul.nair@lntinfotech.com",
              emailCC : "gokulgnair94@gmail.com",
              emailAttachmentName :"My Opty Report"
            }
           
          }]
        
        },
        reportRequest:
        {
          attributeCalendar :"Gregorian",
          attributeFormat :"HTML",     
          attributeTemplate :"Opty Report",      
          byPassCache :"TRUE",
          flattenXML : "FALSE",
          reportAbsolutePath :"/Custom/BIPTest/TestReport.xdo",  
          sizeOfDataChunkDownload :"-1",
            parameterNameValues:{
                listOfParamNameValues:
                    [{ item: {
                        UIType :"Text",
                          dataType :"String",
                          fieldSize : "20",
                          label : "Record Id",
                          multiValuesAllowed : "FALSE",
                          name : "Id",
                          refreshParamOnChange : "FALSE",
                          selectAll :"FALSE",
                          templateParam :"FALSE",
                          useNullForAll :"TRUE",
                        values:[{
                          item:"300000006786070"
                        }]
                    }},{ 
                        item: {
                        UIType :"Text",
                          dataType :"String",
                          fieldSize : "20",
                          label : "Object Name",
                          multiValuesAllowed : "FALSE",
                          name : "Object_Name",
                          refreshParamOnChange : "FALSE",
                          selectAll :"FALSE",
                          templateParam :"FALSE",
                          useNullForAll :"TRUE",
                        values:[{
                          item:"Deals_c"
                        }]
                    }}
                    ]
                    
                }
            },
        "userID" : "LNT001",
        "password" : "lntLNT2K16_1"
        
    };
    
    soap.createClient(url, function(err, client) {

        client.scheduleReport(args, function(err, result) {
            console.log( result );
        });
    });
}