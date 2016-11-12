'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var NewKeyPage;
var NewKeyList;
var NewKeyInstance;
var NewKeyContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewKeyPage
 * @augments Page
 * @description Initialize the NewKeyPage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns NewKeyPage
 */
/* jshint ignore:end */
function NewKeyPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(NewKeyPage.prototype, Page.prototype);
NewKeyPage.prototype.constructor = NewKeyPage;

/* jshint ignore:start */
/**
 * Build an instance of NewKeyInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.NewKeyPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns NewKeyInstance
 */
/* jshint ignore:end */
NewKeyPage.prototype.getInstance = function getInstance(payload) {
  return new NewKeyInstance(
    this._version,
    payload,
    this._solution.accountSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewKeyList
 * @description Initialize the NewKeyList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 */
/* jshint ignore:end */
function NewKeyList(version, accountSid) {
  /* jshint ignore:start */
  /**
   * @function newKeys
   * @memberof Twilio.Api.V2010.AccountContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.NewKeyContext}
   */
  /* jshint ignore:end */
  function NewKeyListInstance(sid) {
    return NewKeyListInstance.get(sid);
  }

  NewKeyListInstance._version = version;
  // Path Solution
  NewKeyListInstance._solution = {
    accountSid: accountSid
  };
  NewKeyListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/Keys.json' // jshint ignore:line
  )(NewKeyListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a NewKeyInstance
   *
   * @function create
   * @memberof Twilio.Api.V2010.AccountContext.NewKeyList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} opts.accountSid - The account_sid
   * @param {string} [opts.friendlyName] - The friendly_name
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed NewKeyInstance
   */
  /* jshint ignore:end */
  NewKeyListInstance.create = function create(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': opts.friendlyName
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new NewKeyInstance(
        this._version,
        payload
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  return NewKeyListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewKeyInstance
 * @description Initialize the NewKeyContext
 *
 * @property {string} sid - The sid
 * @property {string} friendlyName - The friendly_name
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} secret - The secret
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 */
/* jshint ignore:end */
function NewKeyInstance(version, payload, accountSid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.secret = payload.secret; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
  };
}

module.exports = {
  NewKeyPage: NewKeyPage,
  NewKeyList: NewKeyList,
  NewKeyInstance: NewKeyInstance,
  NewKeyContext: NewKeyContext
};
