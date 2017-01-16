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
    'leadsByAdgroup',
    'callsByCity',
    'callsByState',
    'leadsByState',
    'leadsByGender',
    'leadsByAge',
    'leadsByRevenue',
    'leadsByKeyRevenue',
    'leadsByKeyword'
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
      case "leadsByAdgroup":
        exports.leadsByAdgroupChartData()
        .then(data => {
          return sync.updateChartDoc('leadsByAdgroup', data);
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
      case "leadsByRevenue":
          exports.leadsByRevenueChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByRevenue', data);
          })
          .then(data => {
            resolve(data);
          });
          break; 
      case "leadsByKeyRevenue":
          exports.leadsByKeyRevenueChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByKeyRevenue', data);
          })
          .then(data => {
            resolve(data);
          });
          break;  
       case "leadsByKeyword":
          exports.leadsByKeywordChartData()
          .then(data => {
            return sync.updateChartDoc('leadsByKeyword', data);
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


//leads by revenue by adgroup
exports.leadsByRevenueChartData = function() {
   return new Promise(function(resolve, reject) {
      Lead.aggregate([
        { $match: {
            // adgroup: 'rats' 
        }},
        { $group: {
            _id: "$adgroup",
          totalrevenue: { $sum: "$revenue" }
        }}
      ], function (err, results) {
      if (err) {
          console.log(err);
          return;
      }
      // console.log('-----------LOOK HERE');
      // console.log(results);//[ { _id: 'spiders', totalrevenue: 1700 },{},{}]
      summaryByRevenueData = _.map(results, function(revenueDataPoint) {
        return {
           value: revenueDataPoint.totalrevenue,
           color: '#27f927', 
           //'hsl(' + (180 * revenueDataPoint.revenue_count/ results.length)
             //+ ', 100%, 50%)',
           label: revenueDataPoint._id || 'unknown'
         };
       });
       // console.log("summaryByRevenueData");
       // console.log (summaryByRevenueData);
       //[ { value: 1700, color: 'hsl(NaN, 100%, 50%)', label: 'spiders' },{},{}]

       var data = {
        labels: summaryByRevenueData.map(item => item.label),
         datasets: [
             {
                 label: "Revenue data",
                 data: summaryByRevenueData.map(item => item.value),//data: [ 1700, 9898, 24898 ]
                 backgroundColor: summaryByRevenueData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}

// Leads by Adgroup
exports.leadsByAdgroupChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find()
     .then(function(existingLeads) {
       return _.countBy(existingLeads,'adgroup');
     })
     .then((results) => {
       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           adgroup: value[0],
           lead_count: value[1]
         };
       });
       // console.log("**********************");
       // console.log(results);

       summaryByLeadData = _.map(results, function(adgroupDataPoint) {
         return {
           value: adgroupDataPoint.lead_count,
           color: 'hsl(' + (180 * adgroupDataPoint.lead_count/ results.length)
             + ', 100%, 50%)',
           label: adgroupDataPoint.adgroup || 'unknown'
         };
       });
       var data = {
         labels: summaryByLeadData.map(item => item.label),
         datasets: [
             {
                 data: summaryByLeadData.map(item => item.value),
                 backgroundColor: summaryByLeadData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}


// Leads by Keywords
exports.leadsByKeywordChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find({
      adgroup: 'rats'
     })
     .then(function(existingLeads) {
       return _.countBy(existingLeads,'keyword');
     })
     .then((results) => {
       results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
         return {
           keyword: value[0],
           lead_count: value[1]
         };
       });

       summaryByLeadData = _.map(results, function(keywordDataPoint) {
         return {
           value: keywordDataPoint.lead_count,
           color: 'hsl(' + (180 * keywordDataPoint.lead_count/ results.length)
             + ', 100%, 50%)',
           label: keywordDataPoint.keyword || 'unknown'
         };
       });
       var data = {
         labels: summaryByLeadData.map(item => item.label),
         datasets: [
             {
                 data: summaryByLeadData.map(item => item.value),
                 backgroundColor: summaryByLeadData.map(item => item.color)
             }]
       };
       resolve(data);
     })
  });
}


//leads by state
exports.leadsByStateChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.find({
      keyword: 'extermination',
      adgroup: 'rats'
     })
     .then(function(existingLeads) {
       return _.countBy(existingLeads, 'state');
       console.log("now check"+ existingLeads);
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
     Lead.find({
      keyword: 'extermination',
      adgroup: 'rats'
     })
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
     Lead.find({
      keyword: 'extermination',
      adgroup: 'rats'
     })
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
       summaryByAgeData = _.map(results, function(ageDataPoint) {
         return {
           value: ageDataPoint.age_count,
           color: '#f7f927',
           label: ageDataPoint.range || 'unknown'
         };
       });
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

//leads by revenue by adgroup per keyword
exports.leadsByKeyRevenueChartData = function() {
   return new Promise(function(resolve, reject) {
     Lead.aggregate([
        { $match: {
            // adgroup: 'rats' 
        }},
        { $group: {
            _id: "$keyword",
          totalrevenue: { $sum: "$revenue" }
        }}
      ], function (err, results) {
      if (err) {
          console.log(err);
          return;
      }
      // console.log('-----------');
      // console.log(results);//[ { _id: 'spiders', totalrevenue: 1700 },{},{}]
      summaryByRevenueData = _.map(results, function(revenueDataPoint) {
        return {
           value: revenueDataPoint.totalrevenue,
           color: '#FF5733', 
           //'hsl(' + (180 * revenueDataPoint.revenue_count/ results.length)
             //+ ', 100%, 50%)',
           label: revenueDataPoint._id || 'unknown'
         };
       });
      // console.log('----------');
      // console.log(summaryByRevenueData);
       //[ { value: 1700, color: 'hsl(NaN, 100%, 50%)', label: 'spiders' },{},{}]

       var data = {
        labels: summaryByRevenueData.map(item => item.label),
         datasets: [
             {
                 label: "Revenue data",
                 data: summaryByRevenueData.map(item => item.value),//data: [ 1700, 9898, 24898 ]
                 backgroundColor: summaryByRevenueData.map(item => item.color)
             }]
       };
       console.log("keyrevenue"+data);
       resolve(data);
    });
  });
}


