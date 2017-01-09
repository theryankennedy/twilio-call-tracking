var availableNumbers = require('./availableNumbers');
var callSources = require('./callSources');
var calls = require('./calls');
var dashboard = require('./dashboard');
var ivr = require('./ivrmenu');
var concierge = require('./concierge');
var leads = require('./leads');
var sync = require('./sync');
var charts = require('./charts');
var ads = require('./ads');

// Map routes to controller functions
exports.webRoutes = function(router) {
  router.get('/', function(req, resp) {
    return resp.redirect(302, '/dashboard');
  });
  router.get('/available-numbers', availableNumbers.index);
  router.post('/call-source', callSources.create);
  router.get('/call-source/:id/edit', callSources.edit);
  router.post('/call-source/:id/update', callSources.update);
  router.get('/dashboard', dashboard.show);
  router.get('/call/summary-by-call-source', charts.callsByCallSource);
  router.get('/call/summary-by-city', charts.callsByCity);
  router.get('/callsdata', calls.getCalls);
  router.get('/calls', calls.show);
  // router.get('/leadsdata', calls.getLeads);
  router.put('/leads/:callernumber', leads.saveLead);
  router.get('/getleadbynumber/:callernumber', leads.getByCallerNumber);
  router.post('/voicetranscribe', calls.voicetranscribe);
  router.post('/ivrmenu',ivr.ivrmenu) ;
  router.post('/gathers',ivr.gathers) ;
  router.post('/whisper',ivr.whisper) ;
  router.post('/connect',ivr.connect) ;
  router.post('/voicemail',ivr.voicemail) ;
  router.post('/sendVoicemailSMS',ivr.sendVoicemailSMS) ;
  router.post('/hangup',ivr.hangup) ;
  router.get('/incall',concierge.incall) ;
  router.get('/token',concierge.token) ;
  router.get('/makecall',concierge.makecall) ;
  router.get('/concierge', concierge.show);
  router.get('/leads', leads.show);
  router.get('/synctoken', sync.token);
  router.get('/createsyncdoc', sync.createSyncDoc);

  router.get('/callsByCallSourceChartData', charts.getCallsByCallSourceChartData);
  router.get('/callsByCityChartData', charts.getCallsByCityChartData)
  router.get('/updateCharts', charts.updateCharts);
  router.get('/syncdoc', sync.getSyncDoc);
  router.get('/callsources', callSources.show);
  router.get('/ad', ads.show);
  router.get('/getnumber', ads.getNumber);
  router.get('/addnumber', ads.addNumber);
  router.get('/getnumbers', ads.getNumbers);
  router.get('/landing', ads.show);

};

exports.webhookRoutes = function(router) {
  router.post('/call', calls.create);
  router.post('/recordings', calls.addRecording);
};
