var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');
var sync = require('./sync');

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
    return sync.updateCharts();
  }).catch(function(err) {
    console.log('Failed to forward call:');
    console.log(err);
  });
};

exports.addRecording = function(request, response) {
  Lead.findOne({callSid: request.body.ParentCallSid}).then(function(foundLead) {
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

exports.leadsByLeadSource = function(request, response) {
  Lead.find()
    .populate('leadSource')
    .then(function(existingLeads) {
      var statsByLeadSource = _.countBy(existingLeads, function(lead) {
          return lead.leadSource.description;
      });

      response.send(statsByLeadSource);
    });
};

exports.leadsByLeadSourceChartData = function() {
   return new Promise(function(resolve, reject) {

    Lead.find()
    .populate('leadSource')
    .then(function(existingLeads) {
      return _.countBy(existingLeads, function(lead) {
          return lead.leadSource.description;
      })
    })
    .then((statsByLeadSource) => {
      results = _.map(_.zip(_.keys(statsByLeadSource), _.values(statsByLeadSource)), function(value) {
        return {
          description: value[0],
          lead_count: value[1]
        };
      });
      summaryByLeadSourceData = _.map(results, function(leadSourceDataPoint) {
        return {
          value: leadSourceDataPoint.lead_count,
          color: 'hsl(' + (180 * leadSourceDataPoint.lead_count/ results.length)
            + ', 100%, 50%)',
          label: leadSourceDataPoint.description
        };
      });
      resolve(summaryByLeadSourceData);
    })
  });
}

exports.getLeadsByLeadSourceChartData = function(request, response) {
  exports.leadsByLeadSourceChartData()
  .then(data => {
    response.send(data);
  })
}

exports.updateCharts = function(req, res) {
  //console.log('time to update charts');
  exports.leadsByLeadSourceChartData()
  .then(data => {
    //console.log('got here with ' + data);
    return sync.updateCharts(data);
  })
  .then(data => {
    res.send(data);
  });

}


exports.leadsByCity = function(request, response) {
  Lead.find().then(function(existingLeads) {
    var statsByCity = _.countBy(existingLeads, 'city');
    response.send(statsByCity);
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
