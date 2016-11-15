var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');
var sync = require('./sync');
var charts = require('./charts');



exports.create = function(request, response) {
  var leadSourceNumber = request.body.To;

  var addOnResults = JSON.parse(request.body.AddOns);
  var spamResults = addOnResults.results['marchex_cleancall'];


 // console.log(JSON.parse(request.body.AddOns).results.whitepages_pro_caller_id.result.results[0]);
 console.log(request.body);

  LeadSource.findOne({
    number: leadSourceNumber
  }).then(function(foundLeadSource) {

    // TODO: CALL ROUTING

    // known users go to pros
    // - check the db for an existing lead based on the phone number

    // if it's a new number
    //  - check the description
    //  - if it's a


    // client

    // dial the number
    var twiml = new twilio.TwimlResponse();
    if (spamResults.result.result.recommendation == 'PASS') {
      twiml.dial({
            record:'record-from-answer',
            recordingStatusCallback: config.baseUrl + '/recordings'
        }, foundLeadSource.forwardingNumber);
    } else {
      twiml.hangup();
    }
    response.send(twiml.toString());


    // TODO: SAVE DATA FOR DASHBOARD

    // save to db
    var newLead = new Lead({
      callerNumber: request.body.From,
      callSid: request.body.CallSid,
      leadSource: foundLeadSource._id,
      city: request.body.FromCity,
      state: request.body.FromState,
      callerName: request.body.CallerName,
      blacklisted: spamResults.result.result.recommendation,
      blacklistedReason: spamResults.result.result.reason,
      recordingURL: '',
      callDuration: '',
      createdOn: new Date()
    });

    return newLead.save();

  }).then(newLead => {
    // send summary results for charts to Sync
    charts.updateAllCharts();
  }).catch(function(err) {
    console.log('Failed to forward call:');
    console.log(err);
  });
};

exports.addRecording = function(request, response) {
  console.dir(request.body);
  Lead.findOne({callSid: request.body.CallSid}).then(function(foundLead) {
    foundLead.recordingURL = request.body.RecordingUrl;
    foundLead.callDuration = request.body.CallDuration;
    console.log(foundLead);
    return foundLead.save();
  }).catch(function(error) {
    return response.status(500).send('Could not save recording');
  });
};

//Use of Voicebase Add On
exports.voicetranscribe = function(request, response) {
  var data = JSON.parse(request.body.AddOns);
  var vbUrl= data.results.voicebase_transcription.payload[0].url; //returns https
  var newUrl= 'http'+vbUrl.substring(5); //Doesn't accept https
  rp(newUrl).then(function (transcriberesults)
  {
      Lead.findOne({recordingURL: data.results.voicebase_transcription.links.Recording}).then(function(foundLead) {
        var transcribeResults = JSON.parse(transcriberesults);
        foundLead.transcribeText = transcribeResults.media.transcripts.text;
        return foundLead.save();

      }).catch(function(error) {
        return response.status(500).send('Could not save transcribe');
      });
  });
};

exports.getLeads = function(request, response) {
  Lead.find().then(function(existingLeads) {
    response.send(existingLeads);
  });
};

exports.show = function(request, response) {
  Lead.find().then(function(leads) {
    return response.render('leads', {
      leads: leads
    });
  });
};
