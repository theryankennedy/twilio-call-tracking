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
    gatherNode.say('If you wish to speak to a professional, press 1. If you wish to speak to concierge, press 2');
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
      case '1': twiml.dial('+13038080244'); break;
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