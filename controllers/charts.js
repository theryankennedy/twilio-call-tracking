var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');
var sync = require('./sync');


// -----------------------
// CHARTS and summary data
exports.updateAllCharts = function() {

  let chartNames = [
    'leadsByLeadSource',
    'leadsByCity'
  ];

  let promiseList = chartNames.map(chartName => {
      return exports.updateChart(chartName);
  });

  Promise.all(promiseList).then(values => {
    console.log('finished');
  });

}
exports.updateChart = function(name) {
  return new Promise(function(resolve, reject) {
    switch (name) {
      case "leadsByLeadSource":
        exports.leadsByLeadSourceChartData()
        .then(data => {
          return sync.updateChartDoc('leadsByLeadSource', data);
        })
        .then(data => {
          resolve(data);
        });
        break;
      case "leadsByCity":
        exports.leadsByCityChartData()
        .then(data => {
          return sync.updateChartDoc('leadsByCity', data);
        })
        .then(data => {
          resolve(data);
        });
        break;
      default:
        resolve(name + ' not found');
    }
  });
}

exports.updateCharts = function(req, res) {

  //console.log('name ' + req.query.name);
  let chartName = req.query.name;
  if (!chartName) {
    res.sendStatus(400);
  }

  exports.updateChart(chartName)
  .then(result => {
    res.send(result);
  });

}


// leads by lead source
exports.leadsByLeadSource = function(request, response) {
  Lead.find()
    .populate('leadSource')
    .then(function(existingLeads) {
      var statsByLeadSource = _.countBy(existingLeads, function(lead) {
          return lead.leadSource.description;
      });

      response.send(statsByLeadSource);
    });
};
exports.leadsByLeadSourceChartData = function() {
   return new Promise(function(resolve, reject) {

    Lead.find()
    .populate('leadSource')
    .then(function(existingLeads) {
      return _.countBy(existingLeads, function(lead) {
          return lead.leadSource.description;
      })
    })
    .then((statsByLeadSource) => {
      var results = _.map(_.zip(_.keys(statsByLeadSource), _.values(statsByLeadSource)), function(value) {
        return {
          description: value[0],
          lead_count: value[1]
        };
      });
      var summaryByLeadSourceData = _.map(results, function(leadSourceDataPoint) {
        return {
          value: leadSourceDataPoint.lead_count,
          color: 'hsl(' + (180 * leadSourceDataPoint.lead_count/ results.length)
            + ', 100%, 50%)',
          label: leadSourceDataPoint.description
        };
      });
      var data = {
        labels: summaryByLeadSourceData.map(item => item.label),
        datasets: [
            {
                data: summaryByLeadSourceData.map(item => item.value),
                backgroundColor: summaryByLeadSourceData.map(item => item.color)
            }]
      };
      resolve(data);
    })
  });
}
exports.getLeadsByLeadSourceChartData = function(request, response) {
  exports.leadsByLeadSourceChartData()
  .then(data => {
    response.send(data);
  })
}

// leads by city
exports.leadsByCity = function(request, response) {
  Lead.find().then(function(existingLeads) {
    var statsByCity = _.countBy(existingLeads, 'city');
    response.send(statsByCity);
  });
};
exports.leadsByCityChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find()
     .then(function(existingLeads) {
       return _.countBy(existingLeads, 'city');
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           city: value[0],
           lead_count: value[1]
         };
       });

       summaryByCityData = _.map(results, function(cityDataPoint) {
         return {
           value: cityDataPoint.lead_count,
           color: 'hsl(' + (180 * cityDataPoint.lead_count/ results.length)
             + ', 100%, 50%)',
           label: cityDataPoint.city || 'unknown'
         };
       });

       var data = {
         labels: summaryByCityData.map(item => item.label),
         datasets: [
             {
                 data: summaryByCityData.map(item => item.value),
                 backgroundColor: summaryByCityData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}
exports.getLeadsByCityChartData = function(request, response) {
  exports.leadsByCityChartData()
  .then(data => {
    response.send(data);
  })
}