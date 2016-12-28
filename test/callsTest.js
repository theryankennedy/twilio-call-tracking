require('./testHelper');

var supertest = require('supertest');
var expect = require('chai').expect;
var q = require('q');

var app = require('../webapp');
var config = require('../config');
var CallSource = require('../models/CallSource');
var Call = require('../models/Call');

describe('Call controllers', function() {
  after(function(done) {
    Call.remove({}).then(function() {
      CallSource.remove({}, done);
    });
  });

  beforeEach(function(done) {
    Call.remove({}).then(function() {
      CallSource.remove({}, done);
    });
  });

  describe('POST /call', function() {
    var agent = supertest(app);
    var callerNumber = '+1248623948';
    var callSid = '5up3runiqu3c411s1d';
    var city = 'Some city';
    var state = 'Some state';
    var callerName = 'Someone';

    var callSourceNumber = '+149372894';
    var callSourceDescription = 'Some description';
    var callSourceForwardingNumber = '+132947845';

    it('forwards the call to a different number', function(done) {
      var newCallSource = new CallSource({
        number: callSourceNumber,
        description: callSourceDescription,
        forwardingNumber: callSourceForwardingNumber
      });
      newCallSource.save().then(function() {
        agent
          .post('/call')
          .type('form')
          .send({
            From: callerNumber,
            To: callSourceNumber,
            CallSid: callSid,
            FromCity: city,
            FromState: state,
            CallerName: callerName
          })
          .expect(function(response) {
            var twiml = '<Dial>' 
              + callSourceForwardingNumber.toString() 
              + '</Dial>';
            expect(response.text).to.contain(twiml);
          })
          .expect(200, done);
      });
    });

    it('records a new call', function(done) {
      var newCallSource = new CallSource({
        number: callSourceNumber,
        description: callSourceDescription,
        forwardingNumber: callSourceForwardingNumber
      });
      newCallSource.save().then(function(savedCallSource) {
        agent
          .post('/call')
          .type('form')
          .send({
            From: callerNumber,
            To: callSourceNumber,
            CallSid: callSid,
            FromCity: city,
            FromState: state,
            CallerName: callerName
          })
          .expect(function(response) {
            Call.findOne({}).then(function(newCall) {
              expect(newCall.callerNumber).to.equal(callerNumber);
              expect(newCall.callSource.toString())
                .to.equal(savedCallSource._id.toString());
              expect(newCall.city).to.equal(city);
              expect(newCall.state).to.equal(state);
              expect(newCall.callerName).to.equal(callerName);
            });
          })
          .expect(200, done);
      });
    });
  });

  describe('statistics for pie charts', function() {
    var callSourceOneNumber = '+149372894';
    var callSourceOneDescription = 'Some description';
    var callSourceOneForwardingNumber = '+132947845';

    var callSourceTwoNumber = '+149343243';
    var callSourceTwoDescription = 'Some other description';
    var callSourceTwoForwardingNumber = '+193274345';

    var callerNumber = '+1248623948';
    var callSid = '5up3runiqu3c411s1d';

    it('responds with stats for a calls by call source chart', function(done) {
      var newCallSourceOne = new CallSource({
        number: callSourceOneNumber,
        description: callSourceOneDescription,
        forwardingNumber: callSourceOneForwardingNumber
      }).save();

      var newCallSourceTwo = new CallSource({
        number: callSourceTwoNumber,
        description: callSourceTwoDescription,
        forwardingNumber: callSourceTwoForwardingNumber
      }).save();

      var newCall = new Call({
        callerNumber: callerNumber, 
        callSid: callSid
      });

      q.all([
        newCallSourceOne, 
        newCallSourceTwo
      ]).then(function(savedCallSources) {
        var callSourceOne = savedCallSources[0];
        var callSourceTwo = savedCallSources[1];

        newCall.callSource = callSourceOne._id;
        return newCall.save();
      }).then(function(savedCall) {
        var agent = supertest(app);
        agent
          .get('/call/summary-by-call-source')
          .expect(function(response) {
            expect(response.text).to.equal('{"Some description":1}');
          })
          .expect(200, done);
      }).catch(function(err) {
        console.log(err);
        done();
      });
    });

    it('responds with statistics for a calls by city chart', function(done) {
      var newCallSource = new CallSource({
        number: callSourceOneNumber,
        description: callSourceOneDescription,
        forwardingNumber: callSourceOneForwardingNumber
      }).save();

      var newCall = new Call({
        callerNumber: callerNumber, 
        callSid: callSid, 
        city: 'The moon'
      });

      newCallSource.then(function(savedCallSource) {
        newCall.callSource = savedCallSource._id;
        return newCall.save();
      }).then(function(savedCall) {
        var agent = supertest(app);
        agent
          .get('/call/summary-by-city')
          .expect(function(response) {
            expect(response.text).to.equal('{"The moon":1}');
          })
          .expect(200, done);
      });
    });
  });

});
