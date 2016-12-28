require('./testHelper');

var cheerio = require('cheerio');
var supertest = require('supertest');
var expect = require('chai').expect;

var app = require('../webapp');
var config = require('../config');
var CallSource = require('../models/CallSource');

describe('Dashboard controllers', function() {
  after(function(done) {
    CallSource.remove({}, done);
  });

  beforeEach(function(done) {
    CallSource.remove({}, done);
  });

  describe('GET /dashboard', function() {
    it('shows a list of all call sources', function(done) {

      var testNumber = '+1498324783';
      var testForwardingNumber = '+1982649248';
      var testDescription = 'A description here';

      var newCallSource = new CallSource({
        number: testNumber,
        forwardingNumber: testForwardingNumber,
        description: testDescription
      });

      var saveResult = newCallSource.save();
      saveResult.then(function() {
        var agent = supertest(app);
        agent
          .get('/dashboard')
          .expect(function(response) {
            expect(response.text).to.contain(testNumber);
            expect(response.text).to.contain(testForwardingNumber);
            expect(response.text).to.contain(testDescription);
          })
          .expect(200, done);
      });
    });
  });
});
