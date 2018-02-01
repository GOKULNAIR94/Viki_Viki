module.exports = function ( speech, suggests, req, resp, callback){ 

    if (req.body.originalRequest.source == "google") {
                res.json({
                    speech: speech,
                    displayText: speech,
                    //contextOut : [{"name":"oppty-followup","lifespan":5,"parameters":{"objType":"activities"}}],
                    data: {
                        google: {
                            'expectUserResponse': true,
                            'isSsml': false,
                            'noInputPrompts': [],
                            'richResponse': {
                                'items': [{
                                    'simpleResponse': {
                                        'textToSpeech': speech,
                                        'displayText': speech
                                    }
                                }],
                                "suggestions": suggests
                            }
                        }
                    }
                });
            }else{
                res.json({
                    speech: speech,
                    displayText: speech
                });
            }
}
