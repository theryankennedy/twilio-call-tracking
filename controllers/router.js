var availableNumbers = require('./availableNumbers');
var leadSources = require('./leadSources');
var leads = require('./leads');
var dashboard = require('./dashboard');
var sync = require('./sync');

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
  router.get('/lead/summary-by-lead-source', leads.leadsByLeadSource);
  router.get('/lead/summary-by-city', leads.leadsByCity);
  router.get('/leadsdata', leads.getLeads);
  router.get('/leads', leads.show);
  router.post('/voicetranscribe', leads.voicetranscribe);
  router.get('/synctoken', sync.token);

};

exports.webhookRoutes = function(router) {
  router.post('/lead', leads.create);
  router.post('/recordings', leads.addRecording);
};
