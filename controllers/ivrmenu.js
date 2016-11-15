// var express = require('express');
// var bodyParser = require('body-parser');
var twilio = require('twilio');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');

var client = twilio(config.accountSid, config.authToken);
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });

exports.ivrmenu = function (request, response) {
  let twiml = new twilio.TwimlResponse();

  twiml.say({voice:'woman'}, 'Welcome to LeadMetrix!');
  twiml.gather({ 
    numDigits: 1,
    action: '/gathers'
  }, (gatherNode) => {
    gatherNode.say({voice:'woman'},'If you wish to speak to a professional, press 1. If you wish to speak to concierge, press 2');
  });

  twiml.redirect('/ivrmenu');
  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/gather', (request, response) => {
exports.gathers = function(request, response) {
  let twiml = new twilio.TwimlResponse();

  if (request.body.Digits) {
    switch (request.body.Digits) {
      //decide on the numbers to dial in 
      case '1': twiml.dial({action: config.baseUrl + '/voicemail'}, function() {
        this.number('+14158002920', {
          url: config.baseUrl + '/whisper'
        });
      });
      case '2': twiml.dial('+13474297453'); break; //concierge
      //case '3': twiml.dial('+13038080244'); break;
      default: 
        twiml.say('Sorry, I don\'t understand that choice.').pause();
        twiml.redirect('/ivrmenu');
        break;
    }
  } else {
    twiml.redirect('/ivrmenu');
  }
  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/whisper', (request, response) => {
exports.whisper = function(request, response) {
  let twiml = new twilio.TwimlResponse();
  console.log(request.body);
  twiml.gather({ 
    numDigits: 1,
    action: '/connect'
  }, function () {
      this
        .say('You have a call from Lead Metrix. Press any key to accept the call, or hang up to send the caller to voicemail.');
    })
    .say('Sending the caller to voicemail.')
    .hangup();

  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/connect', (request, response) => {
exports.connect = function(request, response) {
  let twiml = new twilio.TwimlResponse();

  twiml.say('You are now connected');
  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/voicemail', (request, response) => {
exports.voicemail = function(request, response) {
  let twiml = new twilio.TwimlResponse();

  twiml
    .say('Your agent is not currently available. ' +
         'Please leave a message after the beep',
         { voice: 'alice' })
    .record({
      maxLength: 20,
      action: '/hangup',
      recordingStatusCallback: '/sendVoicemailSMS'
    })
    .say('No recording received. Goodbye',
        { voice: 'alice' })
    .hangup();

  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/sendVoicemailSMS', (request, response) => {
exports.sendVoicemailSMS = function(request, response) {
  let twiml = new twilio.TwimlResponse();

  client.calls(request.body.CallSid).get(function(err, call) {
    console.log(call.to);
    console.log(call.from);
    
    client.messages.create({ 
    to: call.to, 
    from: config.ivrNumber, 
    body: "You have a new voicemail: " + request.body.RecordingUrl,  
    }, function(err, message) { 
      console.log(message.sid); 
    });
  
    client.messages.create({ 
    to: call.from, 
    from: config.ivrNumber, 
    body: "Your voicemail has been sent: " + request.body.RecordingUrl,  
    }, function(err, message) { 
      console.log(message.sid); 
    });

  });

  response.type('text/xml');
  response.send(twiml.toString());
};

//app.post('/hangup', (request, response) => {
exports.hangup = function(request, response) {
  let twiml = new twilio.TwimlResponse();

  twiml.say('Thank you.');
  twiml.hangup();
  response.type('text/xml');
  response.send(twiml.toString());
};