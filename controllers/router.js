var availableNumbers = require('./availableNumbers');
var leadSources = require('./leadSources');
var leads = require('./leads');
var dashboard = require('./dashboard');
var ivr = require('./ivrmenu');
var concierge = require('./concierge');
var sync = require('./sync');
var charts = require('./charts');


// Map routes to controller functions
exports.webRoutes = function(router) {
  router.get('/', function(req, resp) {
    return resp.redirect(302, '/dashboard');
  });
  router.get('/available-numbers', availableNumbers.index);
  router.post('/lead-source', leadSources.create);
  router.get('/lead-source/:id/edit', leadSources.edit);
  router.post('/lead-source/:id/update', leadSources.update);
  router.get('/dashboard', dashboard.show);
  router.get('/lead/summary-by-lead-source', charts.leadsByLeadSource);
  router.get('/lead/summary-by-city', charts.leadsByCity);
  router.get('/leadsdata', leads.getLeads);
  router.get('/leads', leads.show);
  router.post('/voicetranscribe', leads.voicetranscribe);
  router.post('/ivrmenu',ivr.ivrmenu) ;
  router.post('/gathers',ivr.gathers) ;
  router.get('/incall',concierge.incall) ;
  router.get('/token',concierge.token) ;
  router.get('/makecall',concierge.makecall) ;
  router.get('/concierge', concierge.show);
  router.get('/synctoken', sync.token);
  router.get('/createsyncdoc', sync.createSyncDoc);

  router.get('/leadsByLeadSourceChartData', charts.getLeadsByLeadSourceChartData);
  router.get('/leadsByCityChartData', charts.getLeadsByCityChartData)
  router.get('/updateCharts', charts.updateCharts);
  router.get('/syncdoc', sync.getSyncDoc);

};

exports.webhookRoutes = function(router) {
  router.post('/lead', leads.create);
  router.post('/recordings', leads.addRecording);
};
