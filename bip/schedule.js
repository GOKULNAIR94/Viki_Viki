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
        bookBindingOutputOption :false,
        dataModelUrl :"/Custom/BIPTest/TestDS.xdm",
        endDate :"2017-03-10",   
        mergeOutputOption :false,  
        notificationTo :"gokul.nair@lntinfotech.com",
        notificationUserName :"ranjana",
        notifyHttpWhenFailed :true,
        notifyHttpWhenSkipped :true,
        notifyHttpWhenSuccess :true,
        notifyHttpWhenWarning :true,
        notifyWhenFailed :true,
        notifyWhenSkipped :true,
        notifyWhenSuccess :true,
        notifyWhenWarning :true,    
        repeatCount :0,
        repeatInterval :0,
        saveDataOption :true,
        saveOutputOption :true,
        scheduleBurstringOption :false,
        scheduleBurstingOption :false,
        schedulePublicOption :true,
        startDate :"2016-01-29",
        useUTF8Option :true,
        userJobDesc :"My Template Test",
        userJobName :"MyJob1111",
        deliveryChannels:
        {
          emailOptions:
          {
            item:
            [{

              emailBody :"Hello,\nSending you the report in the pdf format\n\nThanks and regards,\nOSC Team\n\n",

              emailFrom :"gokul.nair@lntinfotech.com",
              emailReplyTo :"NA",
              emailServerName :"DefaultEmail",
              emailSubject :"Opty Report",
              emailTo :"gokul.nair@lntinfotech.com",
              emailCC : "",
              emailAttachmentName :"My Opty Report",
            }]
          }
        },
        reportRequest:
        {
          attributeCalendar :"Gregorian",
          attributeFormat :"HTML",     
          attributeTemplate :"Opty Report",      
          byPassCache :true,
          flattenXML :false,
          reportAbsolutePath :"/Custom/BIPTest/TestReport.xdo",  
          sizeOfDataChunkDownload :-1,
            parameterNameValues:{
                listOfParamNameValues:{
                    item: [{
                        UIType :"Text",
                          dataType :"String",
                          fieldSize : 20,
                          label : "Record Id",
                          multiValuesAllowed : "FALSE",
                          name : "Id",
                          refreshParamOnChange : "FALSE",
                          selectAll :"FALSE",
                          templateParam :"FALSE",
                          useNullForAll :"TRUE",
                        values:{
                            item:[{
                                item:"300000006786070"
                            }]
                        }
                    },
                          {
                        UIType :"Text",
                          dataType :"String",
                          fieldSize : 20,
                          label : "Object Name",
                          multiValuesAllowed : "FALSE",
                          name : "Object_Name",
                          refreshParamOnChange : "FALSE",
                          selectAll :"FALSE",
                          templateParam :"FALSE",
                          useNullForAll :"TRUE",
                        values:{
                            item:[{
                                item:"Deals_c"
                            }]
                        }
                    }]
                }
            }
        }
    }
    
    soap.createClient(url, function(err, client) {

        client.runReport(args, function(err, result) {
            console.log( result );
        });
    });
}