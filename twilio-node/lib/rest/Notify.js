'use strict';

var _ = require('lodash');
var Domain = require('../base/Domain');
var V1 = require('./notify/V1');


/* jshint ignore:start */
/**
 * Initialize notify domain
 *
 * @constructor Twilio.Notify
 *
 * @property {Twilio.Notify.V1} v1 - v1 version
 * @property {Twilio.Notify.V1.CredentialList} credentials - credentials resource
 * @property {Twilio.Notify.V1.ServiceList} services - services resource
 *
 * @param {Twilio} twilio - The twilio client
 */
/* jshint ignore:end */
function Notify(twilio) {
  Domain.prototype.constructor.call(this, twilio, 'https://notify.twilio.com');

  // Versions
  this._v1 = undefined;
}

_.extend(Notify.prototype, Domain.prototype);
Notify.prototype.constructor = Notify;

Object.defineProperty(Notify.prototype,
  'v1', {
  get: function() {
    this._v1 = this._v1 || new V1(this);
    return this._v1;
  },
});

Object.defineProperty(Notify.prototype,
  'credentials', {
  get: function() {
    return this.v1.credentials;
  },
});

Object.defineProperty(Notify.prototype,
  'services', {
  get: function() {
    return this.v1.services;
  },
});

module.exports = Notify;
