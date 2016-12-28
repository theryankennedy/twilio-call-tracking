require('./testHelper');

var cheerio = require('cheerio');
var supertest = require('supertest');
var expect = require('chai').expect;
var vcr = require('nock-vcr-recorder-mocha');

var app = require('../webapp');
var config = require('../config');
var CallSource = require('../models/CallSource');

describe('Call sources controllers', function() {
  after(function(done) {
    CallSource.remove({}, done);
  });

  beforeEach(function(done) {
    CallSource.remove({}, done);
  });

  describe('POST /call-source', function() {
    vcr.it('saves the number after purchase', function(done) {
      var agent = supertest(app);
      var phoneNumberToPurchase = '+12568417192';

      agent
        .post('/call-source')
        .type('form')
        .send({
          phoneNumber: phoneNumberToPurchase
        })
        .expect(303)
        .expect(function(response) {
          CallSource.findOne({number: phoneNumberToPurchase})
            .then(function(found) {
              expect(response.headers.location)
                .to.equal('/call-source/' + found._id + '/edit');
            });
        })
        .end(function(err, res) {
          done();
        });
    });
  });

  describe('GET /call-source/:id/edit', function() {
    it('displays existing values', function(done) {
      var agent = supertest(app);
      var phoneNumber = '+155555555';
      var forwardingNumber = '+177777777';
      var callSource = new CallSource({
        number: phoneNumber,
        description: 'Some description',
        forwardingNumber: forwardingNumber
      });
      callSource.save().then(function() {
        agent
          .get('/call-source/' + callSource._id + '/edit')
          .expect(function(response) {
            var $ = cheerio.load(response.text);
            expect($('input#description')[0].attribs.value)
              .to.equal('Some description');
            expect($('input#forwardingNumber')[0].attribs.value)
              .to.equal(forwardingNumber);
          })
          .expect(200, done);
      });
    });
  });

  describe('POST /call-source/:id/update', function() {
    it('validates a description and forwarding number', function(done) {
      var agent = supertest(app);
      var phoneNumber = '+155555555';
      var forwardingNumber = '+177777777';
      var callSource = new CallSource({
        number: phoneNumber,
        description: 'Some description',
        forwardingNumber: forwardingNumber
      });

      callSource.save().then(function() {
        var updateUrl = '/call-source/' + callSource._id + '/update';
        var editUrl = '/call-source/' + callSource._id + '/edit';
        agent
          .post(updateUrl)
          .type('form')
          .send({
            description: '',
            forwardingNumber: ''
          })
          .expect(function(response) {
            expect(response.headers.location).to.equal(editUrl);
          })
          .expect(303, done);
      });
    });

    it('updates an existing call source and redirects', function(done) {
      var agent = supertest(app);
      var phoneNumber = '+155555555';
      var newDescription = 'Some new description';
      var newForwardingNumber = '+177777777';
      var callSource = new CallSource({number: phoneNumber});

      callSource.save().then(function() {
        var updateUrl = '/call-source/' + callSource._id + '/update';
        agent
          .post(updateUrl)
          .type('form')
          .send({
            description: newDescription,
            forwardingNumber: newForwardingNumber
          })
          .expect(function(response) {
            expect(response.headers.location).to.equal('/dashboard');
              var result = CallSource.findOne({number: phoneNumber})
              result.then(function(foundCallSource) {
                expect(foundCallSource.description).to.equal(newDescription);
                expect(foundCallSource.forwardingNumber)
                  .to.equal(newForwardingNumber);
              });
          })
          .expect(303, done);
      });
    });
  });
});
