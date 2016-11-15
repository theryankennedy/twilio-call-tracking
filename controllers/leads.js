var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');
var sync = require('./sync');
var charts = require('./charts');
//var LookupsClient = require('twilio').LookupsClient;
//var client = new LookupsClient(config.accountSid, config.authToken);


exports.create = function(request, response) {
  var leadSourceNumber = request.body.To;
  var forwardingNumber = config.ivrNumber; //'+14089164333'
  var twiml = new twilio.TwimlResponse();
  var addOnResults = JSON.parse(request.body.AddOns);
  var spamResults = addOnResults.results['marchex_cleancall'];
  var nextCallerResults = addOnResults.results['nextcaller_advanced_caller_id'];
  //var client = LookupsClient(config.accountSid, config.authToken);

  //console.log('caller ID Info: ');


  //Create new Lead
  var newLead = new Lead({
    callerNumber: request.body.From,
    callSid: request.body.CallSid,
    leadSource: null,
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
  if (nextCallerResults.result.records != null) {
    newLead.gender = nextCallerResults.result.records[0].gender;
  }
  if (nextCallerResults.result.records != null) {
    newLead.age = parseInt(nextCallerResults.result.records[0].age, 10)
  }
  LeadSource.findOne({
    number: leadSourceNumber
  }).then(function(foundLeadSource) {
    if (foundLeadSource != null) {
      forwardingNumber = foundLeadSource.forwardingNumber;
      newLead.leadSource = foundLeadSource._id;

      Lead.findOne({callerNumber: request.body.From}).then(function(foundLead) {
        if (foundLead != null && foundLead.ProNumber != null && foundLead.ProNumber != '') {
          forwardingNumber = foundLead.ProNumber;
          console.log('Existing Lead:');
          console.log(foundLead);
        }
      }).catch(function(error) {
        console.log('Error finding Lead');
        console.log(error);
      });

      newLead.ProNumber = forwardingNumber;

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
      //no leadsource found
      Lead.findOne({callerNumber: request.body.From}).then(function(foundLead) {
        if (foundLead != null && foundLead.ProNumber != null && foundLead.ProNumber != '') {
          forwardingNumber = foundLead.ProNumber;
          if (spamResults.result.result.recommendation == 'PASS') {
            twiml.dial(forwardingNumber);
          } 
          else {
            twiml.hangup();
          }
          console.log('existing lead!');
          console.log(foundLead);
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
        console.log('New lead!');
      });
      
    }
  }).then(newLead => {
    // send summary results for charts to Sync
    charts.updateAllCharts();
  }).catch(function(err) {
    console.log('Failed to forward call:');
    console.log(err);

  });
  //response.send(twiml.toString());
  console.log('NEW LEAD');
  console.log(newLead);
  return newLead.save();
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
