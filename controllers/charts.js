var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
var CallSource = require('../models/CallSource');
var Call = require('../models/Call');
var config = require('../config');
var Lead = require('../models/Lead');
var sync = require('./sync');
//var pattern = require('patternomaly');


// -----------------------
// CHARTS and summary data
exports.updateAllCharts = function() {

  console.log('updating charts');

  let chartNames = [
    'callsByCallSource',
    'callsByCity',
    'callsByState',
    'leadsByState',
    'leadsByGender',
    'leadsByAge'
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
      case "callsByCallSource":
        exports.callsByCallSourceChartData()
        .then(data => {
          return sync.updateChartDoc('callsByCallSource', data);
        })
        .then(data => {
          resolve(data);
        });
        break;
      case "callsByCity":
        exports.callsByCityChartData()
        .then(data => {
          return sync.updateChartDoc('callsByCity', data);
        })
        .then(data => {
          resolve(data);
        });
        break;
      case "callsByState":
          exports.callsByStateChartData()
          .then(data => {
            return sync.updateChartDoc('callsByState', data);
          })
          .then(data => {
            resolve(data);
          });
          break;
      case "leadsByState":
          exports.leadsByStateChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByState', data);
          })
          .then(data => {
            resolve(data);
          });
          break; 
      case "leadsByGender":
          exports.leadsByGenderChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByGender', data);
          })
          .then(data => {
            resolve(data);
          });
          break;   
      case "leadsByAge":
          exports.leadsByAgeChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByAge', data);
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


// calls by call source
exports.callsByCallSource = function(request, response) {
  Call.find()
    .populate('callSource')
    .then(function(existingCalls) {
      var statsByCallSource = _.countBy(existingCalls, function(call) {
          return call.callSource.description;
      });

      response.send(statsByCallSource);
    });
};
exports.callsByCallSourceChartData = function() {
   return new Promise(function(resolve, reject) {
     console.log('about to Call.find');
    Call.find()
    .populate('callSource')
    .then(function(existingCalls) {
      console.log('got the calls');
      return _.countBy(existingCalls, function(call) {
          if (!call.callSource) {
            return 'butter';
          } else {
            return call.callSource.description
          }
      })
    })
    .then((statsByCallSource) => {
      console.log('got some call stats');
      var results = _.map(_.zip(_.keys(statsByCallSource), _.values(statsByCallSource)), function(value) {
        return {
          description: value[0],
          call_count: value[1]
        };
      });
      var summaryByCallSourceData = _.map(results, function(callSourceDataPoint) {
        return {
          value: callSourceDataPoint.call_count,
          color: 'hsl(' + (180 * callSourceDataPoint.call_count/ results.length)
            + ', 100%, 50%)',
          label: callSourceDataPoint.description
        };
      });
      var data = {
        labels: summaryByCallSourceData.map(item => item.label),
        datasets: [
            {
                data: summaryByCallSourceData.map(item => item.value),
                backgroundColor: summaryByCallSourceData.map(item => item.color)
            }]
      };
      resolve(data);
    })
    .catch(function(failure) {
      console.log('Failed getting the data');
      console.log('Error was:');
      console.log(failure);
      reject(failure);
    });
  });
}
exports.getCallsByCallSourceChartData = function(request, response) {
  exports.callsByCallSourceChartData()
  .then(data => {
    response.send(data);
  })
}

// calls by city
exports.callsByCity = function(request, response) {
  Call.find().then(function(existingCalls) {
    var statsByCity = _.countBy(existingCalls, 'city');
    response.send(statsByCity);
  });
};
exports.callsByCityChartData = function() {
   return new Promise(function(resolve, reject) {
     Call.find()
     .then(function(existingCalls) {
       return _.countBy(existingCalls, 'city');
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           city: value[0],
           call_count: value[1]
         };
       });

       summaryByCityData = _.map(results, function(cityDataPoint) {
         return {
           value: cityDataPoint.call_count,
           color: 'hsl(' + (180 * cityDataPoint.call_count/ results.length)
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
exports.getCallsByCityChartData = function(request, response) {
  exports.callsByCityChartData()
  .then(data => {
    response.send(data);
  })
}


exports.callsByStateChartData = function() {
   return new Promise(function(resolve, reject) {
     Call.find()
     .then(function(existingCalls) {
       return _.countBy(existingCalls, 'state');
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           state: value[0],
           call_count: value[1]
         };
       });

       summaryByStateData = _.map(results, function(stateDataPoint) {
         return {
           value: stateDataPoint.call_count,
           color: 'hsl(' + (180 * stateDataPoint.call_count/ results.length)
             + ', 100%, 50%)',
           label: stateDataPoint.state || 'unknown'
         };
       });

       var data = {
         labels: summaryByStateData.map(item => item.label),
         datasets: [
             {
                 data: summaryByStateData.map(item => item.value),
                 backgroundColor: summaryByStateData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}

//leads by state
exports.leadsByStateChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find()
     .then(function(existingLeads) {
       return _.countBy(existingLeads, 'state');
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           state: value[0],
           lead_count: value[1]
         };
       });

       summaryByStateData = _.map(results, function(stateDataPoint) {
         return {
           value: stateDataPoint.lead_count,
           color: 'hsl(' + (180 * stateDataPoint.lead_count/ results.length)
             + ', 100%, 50%)',
           label: stateDataPoint.state || 'unknown'
         };
       });

       var data = {
         labels: summaryByStateData.map(item => item.label),
         datasets: [
             {
                 data: summaryByStateData.map(item => item.value),
                 backgroundColor: summaryByStateData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}

//leads by gender
exports.leadsByGenderChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find()
     .then(function(existingLeads) {
       return _.countBy(existingLeads, 'gender');
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           gender: value[0],
           lead_count: value[1]
         };
       });
   
       summaryByGenderData = _.map(results, function(genderDataPoint) {
         return {
           value: genderDataPoint.lead_count,
           color: 'hsl(' + (180 * genderDataPoint.lead_count/ results.length)
             + ', 100%, 50%)',
           label: genderDataPoint.gender || 'unknown'
         };
       });

       var data = {
         labels: summaryByGenderData.map(item => item.label),
         datasets: [
             {
                 data: summaryByGenderData.map(item => item.value),
                 backgroundColor: summaryByGenderData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}

//leads by age
exports.leadsByAgeChartData = function() {
   return new Promise(function(resolve, reject) {
   // CallSource.findOne({adgroup: rats}).then(function(foundCallSource) {
     Lead.find()
     .then(function(existingLeads) {
      //sumby?
       return _.countBy(existingLeads, function(lead){
        if(lead.age <= 10) {
          return '0 - 10';
        } 
        if(lead.age >10 && lead.age <= 20) {
          return '11 - 20';
        } 
        if(lead.age >20 && lead.age <= 30) {
          return '21 - 30';
        } 
        if(lead.age >30 && lead.age <= 40) {
          return '31 - 40';
        } 
        if(lead.age >40 && lead.age <= 50) {
          return '41 - 50';
        } 
        if(lead.age >50 && lead.age <= 60) {
          return '51 - 60';
        } 
        if(lead.age >60 && lead.age <= 70) {
          return '61 - 70';
        } 
        if(lead.age >70 && lead.age <= 80) {
          return '71 - 80';
        } 
        if(lead.age >80 && lead.age <= 90) {
          return '81 - 90';
        } 
        if(lead.age >90 && lead.age <= 100) {
          return '91 - 100';
        } 

       });
     })
     .then((results) => {

       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           range: value[0],
           age_count: value[1]
         };
       });
    console.log("age results");
       // console.log (results);
       // console.log(results);
       summaryByAgeData = _.map(results, function(ageDataPoint) {
         return {
           value: ageDataPoint.age_count,
           color: 'hsl(' + (180 * ageDataPoint.age_count/ results.length)
             + ', 100%, 50%)',
           label: ageDataPoint.range || 'unknown'
         };
         // console.log("ageDataPoint");
         // console.log(ageDataPoint);
       });
       // console.log("summaryByAgeData");
       // console.log (summaryByAgeData);

       var data = {
         labels: summaryByAgeData.map(item => item.label),
         datasets: [
             {
                 label: "Age data",
                 data: summaryByAgeData.map(item => item.value),
                 backgroundColor: summaryByAgeData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
 // });
}
