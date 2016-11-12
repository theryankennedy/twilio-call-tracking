'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var OriginationUrlPage;
var OriginationUrlList;
var OriginationUrlInstance;
var OriginationUrlContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.OriginationUrlPage
 * @augments Page
 * @description Initialize the OriginationUrlPage
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns OriginationUrlPage
 */
/* jshint ignore:end */
function OriginationUrlPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(OriginationUrlPage.prototype, Page.prototype);
OriginationUrlPage.prototype.constructor = OriginationUrlPage;

/* jshint ignore:start */
/**
 * Build an instance of OriginationUrlInstance
 *
 * @function getInstance
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlPage.prototype.getInstance = function getInstance(payload) {
  return new OriginationUrlInstance(
    this._version,
    payload,
    this._solution.trunkSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.OriginationUrlList
 * @description Initialize the OriginationUrlList
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {string} trunkSid - The trunk_sid
 */
/* jshint ignore:end */
function OriginationUrlList(version, trunkSid) {
  /* jshint ignore:start */
  /**
   * @function originationUrls
   * @memberof Twilio.Trunking.V1.TrunkContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Trunking.V1.TrunkContext.OriginationUrlContext}
   */
  /* jshint ignore:end */
  function OriginationUrlListInstance(sid) {
    return OriginationUrlListInstance.get(sid);
  }

  OriginationUrlListInstance._version = version;
  // Path Solution
  OriginationUrlListInstance._solution = {
    trunkSid: trunkSid
  };
  OriginationUrlListInstance._uri = _.template(
    '/Trunks/<%= trunkSid %>/OriginationUrls' // jshint ignore:line
  )(OriginationUrlListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a OriginationUrlInstance
   *
   * @function create
   * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlList
   * @instance
   *
   * @param {object} opts - ...
   * @param {number} opts.weight - The weight
   * @param {number} opts.priority - The priority
   * @param {string} opts.enabled - The enabled
   * @param {string} opts.friendlyName - The friendly_name
   * @param {string} opts.sipUrl - The sip_url
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed OriginationUrlInstance
   */
  /* jshint ignore:end */
  OriginationUrlListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.weight)) {
      throw new Error('Required parameter "opts.weight" missing.');
    }
    if (_.isUndefined(opts.priority)) {
      throw new Error('Required parameter "opts.priority" missing.');
    }
    if (_.isUndefined(opts.enabled)) {
      throw new Error('Required parameter "opts.enabled" missing.');
    }
    if (_.isUndefined(opts.friendlyName)) {
      throw new Error('Required parameter "opts.friendlyName" missing.');
    }
    if (_.isUndefined(opts.sipUrl)) {
      throw new Error('Required parameter "opts.sipUrl" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'Weight': opts.weight,
      'Priority': opts.priority,
      'Enabled': opts.enabled,
      'FriendlyName': opts.friendlyName,
      'SipUrl': opts.sipUrl
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new OriginationUrlInstance(
        this._version,
        payload,
        this._solution.trunkSid,
        this._solution.sid
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

  /* jshint ignore:start */
  /**
   * Streams OriginationUrlInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  OriginationUrlListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists OriginationUrlInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  OriginationUrlListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of OriginationUrlInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  OriginationUrlListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new OriginationUrlPage(
        this._version,
        payload,
        this._solution
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

  /* jshint ignore:start */
  /**
   * Constructs a origination_url
   *
   * @function get
   * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Trunking.V1.TrunkContext.OriginationUrlContext}
   */
  /* jshint ignore:end */
  OriginationUrlListInstance.get = function get(sid) {
    return new OriginationUrlContext(
      this._version,
      this._solution.trunkSid,
      sid
    );
  };

  return OriginationUrlListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.OriginationUrlInstance
 * @description Initialize the OriginationUrlContext
 *
 * @property {string} accountSid - The account_sid
 * @property {string} sid - The sid
 * @property {string} trunkSid - The trunk_sid
 * @property {number} weight - The weight
 * @property {string} enabled - The enabled
 * @property {string} sipUrl - The sip_url
 * @property {string} friendlyName - The friendly_name
 * @property {number} priority - The priority
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} url - The url
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} trunkSid - The trunk_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function OriginationUrlInstance(version, payload, trunkSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.trunkSid = payload.trunk_sid; // jshint ignore:line
  this.weight = deserialize.integer(payload.weight); // jshint ignore:line
  this.enabled = payload.enabled; // jshint ignore:line
  this.sipUrl = payload.sip_url; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.priority = deserialize.integer(payload.priority); // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.url = payload.url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    trunkSid: trunkSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(OriginationUrlInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new OriginationUrlContext(
        this._version,
        this._solution.trunkSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a OriginationUrlInstance
 *
 * @function fetch
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a OriginationUrlInstance
 *
 * @function remove
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * update a OriginationUrlInstance
 *
 * @function update
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {number} [opts.weight] - The weight
 * @param {number} [opts.priority] - The priority
 * @param {string} [opts.enabled] - The enabled
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.sipUrl] - The sip_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.OriginationUrlContext
 * @description Initialize the OriginationUrlContext
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {sid} trunkSid - The trunk_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function OriginationUrlContext(version, trunkSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    trunkSid: trunkSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Trunks/<%= trunkSid %>/OriginationUrls/<%= sid %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a OriginationUrlInstance
 *
 * @function fetch
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new OriginationUrlInstance(
      this._version,
      payload,
      this._solution.trunkSid,
      this._solution.sid
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

/* jshint ignore:start */
/**
 * remove a OriginationUrlInstance
 *
 * @function remove
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a OriginationUrlInstance
 *
 * @function update
 * @memberof Twilio.Trunking.V1.TrunkContext.OriginationUrlContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {number} [opts.weight] - The weight
 * @param {number} [opts.priority] - The priority
 * @param {string} [opts.enabled] - The enabled
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.sipUrl] - The sip_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed OriginationUrlInstance
 */
/* jshint ignore:end */
OriginationUrlContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'Weight': opts.weight,
    'Priority': opts.priority,
    'Enabled': opts.enabled,
    'FriendlyName': opts.friendlyName,
    'SipUrl': opts.sipUrl
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new OriginationUrlInstance(
      this._version,
      payload,
      this._solution.trunkSid,
      this._solution.sid
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

module.exports = {
  OriginationUrlPage: OriginationUrlPage,
  OriginationUrlList: OriginationUrlList,
  OriginationUrlInstance: OriginationUrlInstance,
  OriginationUrlContext: OriginationUrlContext
};
