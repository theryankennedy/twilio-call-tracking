const AccessToken = require('../twilio-node/index.js').jwt.AccessToken
const SyncGrant = AccessToken.SyncGrant
const randomUsername = require('../randos')
const request = require('request-promise')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID
const apiKey = process.env.TWILIO_API_KEY
const apiSecret = process.env.TWILIO_API_SECRET

/*
Generate an Access Token for a sync application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
module.exports.token = function(request, response) {
  let appName = 'call-tracking-node'
  let identity = randomUsername()
  let deviceId = request.query.device

  // Create a unique ID for the client on their current device
  let endpointId = `${appName}:${identity}:${deviceId}`

  // Create a "grant" which enables a client to use Sync as a given user,
  // on a given device
  let syncGrant = new SyncGrant({
    serviceSid: syncServiceSid,
    endpointId: endpointId
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  let token = new AccessToken(
    accountSid,
    apiKey,
    apiSecret
  )
  token.addGrant(syncGrant)
  token.identity = identity

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  })
}

// not in use
module.exports.createSyncService = (req, res) => {

  let serviceName = 'MySyncServiceInstance';
  let url = `https://${apiKey}:${apiSecret}@preview.twilio.com/Sync/Services`
  let data = { FriendlyName : serviceName }
  request({ url: url, method: 'POST', formData: data})
  .then(response => {
    res.send(response)
  })
  .catch(err => {
    res.status(err.statusCode).send(err.message)
  })

}

module.exports.createSyncMap = (req, res) => {

  // create the map
  let mapName = 'charts';
  let url = `https://${apiKey}:${apiSecret}@preview.twilio.com/Sync/Services/${syncServiceSid}/Maps`;
  let data = { UniqueName : 'Charts' };

  request({ url: url, method: 'POST', formData: data})
  .then(response => {
    res.send(response);
  })
  .catch(err => {
    res.status(err.statusCode).send(err.message)
  });
}

module.exports.createSyncDoc = (req, res) => {

  // create the map
  let name = 'leadsByLeadSource';
  let url = `https://${apiKey}:${apiSecret}@preview.twilio.com/Sync/Services/${syncServiceSid}/Documents`;
  let data = { UniqueName : 'leadsByLeadSource' };

  request({ url: url, method: 'POST', form: data})
  .then(response => {
    res.send(response);
  })
  .catch(err => {
    res.status(err.statusCode).send(err.message)
  });

}

module.exports.updateCharts = (chartData) => {

  let name = 'leadsByLeadSource';
  let url = `https://${apiKey}:${apiSecret}@preview.twilio.com/Sync/Services/${syncServiceSid}/Documents/${name}`

  let data = { Data: JSON.stringify(chartData)};
  console.log(JSON.stringify(chartData));

  return request({
    url: url,
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: data
  })
  .catch(err => {console.log(err.message);});

}

module.exports.getSyncData = (req, res) => {

  let mapName = 'MP547c2d085eea43f6ba00306b62cfdebb';
  let url = `https://${apiKey}:${apiSecret}@preview.twilio.com/Sync/Services/${syncServiceSid}/Maps/${mapName}/Items`

  request({ url: url, method: 'GET'})
  .then(response => {
    res.send(response);
  })
  .catch(err => {
    console.log(err.message);
    res.sendStatus(err.statusCode).send(err.message);
  });

}
