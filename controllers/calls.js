var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var CallSource = require('../models/CallSource');
var Call = require('../models/Call');
var config = require('../config');
var leads = require('./leads');
var sync = require('./sync');
var charts = require('./charts');
var rrequest = require("request");
    // options = {
    //   uri: 'newUrl',
    //   timeout: 2000,
    //   followAllRedirects: true
    // };

//var LookupsClient = require('twilio').LookupsClient;
//var client = new LookupsClient(config.accountSid, config.authToken);


exports.create = function(request, response) {
  var callSourceNumber = request.body.To;
  var forwardingNumber = config.ivrNumber; //'+14089164333'
  var twiml = new twilio.TwimlResponse();
  var addOnResults = JSON.parse(request.body.AddOns);
  var spamResults = addOnResults.results['marchex_cleancall'];
  var nextCallerResults = addOnResults.results['nextcaller_advanced_caller_id'];
  //var client = LookupsClient(config.accountSid, config.authToken);

  //console.log('caller ID Info: ');

  leads.createLead(request.body);
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
  CallSource.findOne({
    number: callSourceNumber
  }).then(function(foundCallSource) {
    if (foundCallSource != null) {
      forwardingNumber = foundCallSource.forwardingNumber;
      newCall.callSource = foundCallSource._id;

      Call.findOne({callerNumber: request.body.From}).then(function(foundCall) {
        if (foundCall != null && foundCall.ProNumber != null && foundCall.ProNumber != '') {
          forwardingNumber = foundCall.ProNumber;
          console.log('Existing Call:');
          console.log(foundCall);
        }
      }).catch(function(error) {
        console.log('Error finding Call');
        console.log(error);
      });

      newCall.ProNumber = forwardingNumber;

      if (spamResults.result.result.recommendation == 'PASS') {
        twiml.dial({
              record:'record-from-answer',
              recordingStatusCallback: config.baseUrl + '/recordings'
          }, forwardingNumber);
      } else {
        twiml.hangup();
      }
      response.send(twiml.toString());

    }
    else {
      //no callsource found
      Call.findOne({callerNumber: request.body.From}).then(function(foundCall) {
        if (foundCall != null && foundCall.ProNumber != null && foundCall.ProNumber != '') {
          forwardingNumber = foundCall.ProNumber;
          if (spamResults.result.result.recommendation == 'PASS') {
            twiml.dial(forwardingNumber);
          }
          else {
            twiml.hangup();
          }
          console.log('existing call!');
          console.log(foundCall);
        }
        else {
          if (spamResults.result.result.recommendation == 'PASS') {
            //console.log('PASSING TO THE IVR!!!!')
            //twiml.redirect(config.baseUrl + '/ivrmenu');
            //console.log(twiml.toString());
            //console.log('After');
                  console.log('Forwarding Number');
      console.log(forwardingNumber);
            twiml.dial(forwardingNumber);
          }
          else {
            twiml.hangup();
          }
        }
        response.send(twiml.toString());
      }).catch(function(error) {
        console.log(error);
        console.log('New call!');
      });

    }
  }).then(newCall => {
    // send summary results for charts to Sync
    charts.updateAllCharts();
  }).catch(function(err) {
    console.log('Failed to forward call:');
    console.log(err);

  });
  //response.send(twiml.toString());
  //console.log('NEW LEAD');
 // console.log(newCall);
  return newCall.save();
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
  //console.log("inside Voicebase");
  var data = JSON.parse(request.body.AddOns);
  var vbUrl= data.results.voicebase_transcription.payload[0].url; //returns https
  // console.log('vbUrl');
  // console.log(vbUrl);
  var newUrl= 'https'+'://'+config.accountSid+':'+config.authToken+'@'+vbUrl.substring(8); //Doesn't accept https
  // console.log('newUrl');
  // console.log(newUrl);
  var r = rrequest.get(newUrl, function (err, response, body) {
 //   console.log(response.uri.href);
     if (!err && response.statusCode == 200) {
        console.log(body)}
      });
  //newUrl == r;
  // console.log('r is here');
  //  console.log(r);
  // console.log(response.Request.uri.href);


  rp(newUrl).then(function (transcriberesults)
  {
      //console.log("at the transcriberesults");
      //console.log(transcriberesults);
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
