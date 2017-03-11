var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var CallSource = require('../models/CallSource');
var PoolNumber = require('../models/PoolNumber');
var Call = require('../models/Call');
var config = require('../config');
var leads = require('./leads');
var sync = require('./sync');
var charts = require('./charts');
var rrequest = require('request');

exports.create = function(request, response) {
  var callSourceNumber = request.body.To;
  var forwardingNumber = config.ivrNumber;
  var twiml = new twilio.TwimlResponse();
  var addOnResults = JSON.parse(request.body.AddOns);
  var spamResults = addOnResults.results['marchex_cleancall'];
  var nextCallerResults = addOnResults.results['nextcaller_advanced_caller_id'];

  //Create new Call
  var newCall = new Call({
    callerNumber: request.body.From,
    callSid: request.body.CallSid,
    callSource: null,
    ProNumber: '',
    city: request.body.FromCity,
    state: request.body.FromState,
    callerName: request.body.CallerName,
    blacklisted: spamResults.result.result.recommendation,
    blacklistedReason: spamResults.result.result.reason,
    recordingURL: '',
    callDuration: '',
    createdOn: new Date()
  });

  //setting default age to 25 and gender to male
  if (nextCallerResults.result.records != null) {
    newCall.gender = nextCallerResults.result.records[0].gender || 'Male';
  }
  if (nextCallerResults.result.records != null) {
    newCall.age = parseInt(nextCallerResults.result.records[0].age || 25, 10)
  }

  PoolNumber.findOne({
    number: callSourceNumber
  }).populate('callSource')
  .then((foundNumberPool) => {

    if (!foundNumberPool) {
      console.log('error: cant find numberPool record in db for ' + callSourceNumber);
      twiml.say("Sorry. We can't find a record for this number.");
      newCall.save();
      charts.updateAllCharts();
      response.send(twiml.toString());
    }

    forwardingNumber = foundNumberPool.callSource.forwardingNumber;
    newCall.callSource = foundNumberPool.callSource._id;
    newCall.numberPool = foundNumberPool._id;

    // block spam calls
    if (spamResults.result.result.recommendation == 'PASS') {

      // dial an agent, ivr, or pstn number
      console.log('forwardingNumber=' + forwardingNumber);
      if (forwardingNumber === 'agent') {
        twiml.dial({record:'record-from-answer',
                   recordingStatusCallback: config.baseUrl + '/recordings'},
                   (parent) => {
                     parent.client(config.agentName);
                   });
      } else if (forwardingNumber === 'ivr') {
         twiml.dial({record:'record-from-answer',
                   recordingStatusCallback: config.baseUrl + '/recordings'},
                   config.ivrNumber);
      } else {
        twiml.dial({
                record:'record-from-answer',
                recordingStatusCallback: config.baseUrl + '/recordings'
            }, forwardingNumber);
      }

    } else {
      twiml.hangup();
    }

    newCall.save();
    leads.createLead(request.body, newCall,foundNumberPool.callSource.adgroup,foundNumberPool.callSource.keyword);
    charts.updateAllCharts();
    response.send(twiml.toString());

  }).catch((error) => {
    console.log('error finding the number in the number poooool' + error);
    twiml.say("error error error.");
    response.send(twiml.toString());
  });
};

exports.addRecording = function(request, response) {
  console.dir(request.body);
  Call.findOne({callSid: request.body.CallSid}).then(function(foundCall) {
    foundCall.recordingURL = request.body.RecordingUrl;
    foundCall.callDuration = request.body.CallDuration;
    console.log(foundCall);
    return foundCall.save();
  }).catch(function(error) {
    return response.status(500).send('Could not save recording');
  });
};

//Use of Voicebase Add On
exports.voicetranscribe = function(request, response) {
  var data = JSON.parse(request.body.AddOns);
  var vbUrl= data.results.voicebase_transcription.payload[0].url; //returns https
  var newUrl= 'https'+'://'+config.accountSid+':'+config.authToken+'@'+vbUrl.substring(8); //Doesn't accept https
  var r = rrequest.get(newUrl, function (err, response, body) {
     if (!err && response.statusCode == 200) {
        console.log(body)}
      });

  rp(newUrl).then(function (transcriberesults)
  {
      Call.findOne({recordingURL: data.results.voicebase_transcription.links.Recording}).then(function(foundCall) {
        var transcribeResults = JSON.parse(transcriberesults);
        foundCall.transcribeText = transcribeResults.media.transcripts.text;

        return foundCall.save();

      }).catch(function(error) {
        console.log(error);
        return response.status(500).send('Could not save transcribe');

      });
  }).catch(function(error) {
        console.log(error);
        return response.status(500).send('Error for rp');
      });
};

exports.getCalls = function(request, response) {
  Call.find().then(function(existingCalls) {
    response.send(existingCalls);
  });
};

exports.show = function(request, response) {
  Call.find().then(function(calls) {
    return response.render('calls', {
      calls: calls
    });
  });
};
