module.exports = function ( speech, suggests, contextOut, req, res, callback){ 

    if (req.body.originalRequest.source == "google" || req.body.originalRequest.source == "facebook") {
                res.json({
                    speech: speech,
                    displayText: speech,
                    contextOut : contextOut,
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
                        },
                        facebook: {
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
                                "suggestions": [{"title": "0"},{"title": "1"}]
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
