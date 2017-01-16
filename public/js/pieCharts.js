
function updateChartUI(data, selectorId, type, options) {
  
  if (type === undefined) {
    type = 'polarArea';
  }
  //  if (type === 'bar') {
  //   options: { scales: { yAxes: [{ beginAtZero: true }] } } ;
  // }
  var chartContext = $("#" + selectorId).get(0).getContext("2d");

  var theChart = new Chart(chartContext, {type: type , data: data.dataArray, options: options});
}

// init sync
$.getJSON('/synctoken', function(results) {
  var client = new Twilio.Sync.Client(results.token);

  // listen for updates
  client.document("leadsByAdgroup").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log('updating');
      updateChartUI(updatedResults, 'pie-by-leads-adgroup');
    });
  });
  // client.document("callsByCity").then(function (doc) {
  //   doc.on("updated",function(updatedResults) {
  //     updateChartUI(updatedResults, 'pie-by-city');
  //   });
  // });
  // client.document("callsByState").then(function (doc) {
  //   doc.on("updated",function(updatedResults) {
  //     updateChartUI(updatedResults, 'pie-by-state');
  //   });
  // });
   client.document("leadsByState").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-leads-state');
    });
  });
   client.document("leadsByGender").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-leads-gender');
    });
  });
   client.document("leadsByAge").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log(updatedResults);
      updateChartUI(updatedResults, 'bar-by-leads-age', 'bar', {
        scales: {
          yAxes: [{
            type: "linear",
            ticks: {
                max: 8,
                min: 0,
            }
          }]
        }
      });
    });
  });

client.document("leadsByRevenue").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log(updatedResults);
      updateChartUI(updatedResults, 'bar-by-leads-revenue', 'bar', {
        scales: {
          yAxes: [{
            type: "linear",
            ticks: {
                max: 30000,
                min: 0,
            }
          }]
        }
      });
    });
  });

client.document("leadsByKeyRevenue").then(function (doc) {
    doc.on("updated",function(updatedkeyResults) {
      console.log(updatedkeyResults);
      updateChartUI(updatedkeyResults, 'bar-by-leads-key-revenue', 'bar', {
        scales: {
          yAxes: [{
            type: "linear",
            ticks: {
                max: 30000,
                stepSize: 5000,
                min: 0,
            }
          }]
        }
      });
    });
  });
  client.document("leadsByKeyword").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-leads-keyword');
    });
  });
});

// init the charts on page load
$.getJSON('/updateCharts?name=leadsByAdgroup', function(results) {
  updateChartUI(results.data, 'pie-by-leads-adgroup');
});
// $.getJSON('/updateCharts?name=callsByCity', function(results) {
//   updateChartUI(results.data, 'pie-by-city');
// });
// $.getJSON('/updateCharts?name=callsByState', function(results) {
//   updateChartUI(results.data, 'pie-by-state');
//});
$.getJSON('/updateCharts?name=leadsByState', function(results) {
  updateChartUI(results.data, 'pie-by-leads-state');
});
$.getJSON('/updateCharts?name=leadsByGender', function(results) {
  updateChartUI(results.data, 'pie-by-leads-gender');
});
$.getJSON('/updateCharts?name=leadsByKeyword', function(results) {
  updateChartUI(results.data, 'pie-by-leads-keyword');
});
$.getJSON('/updateCharts?name=leadsByAge', function(results) {
  updateChartUI(results.data, 'bar-by-leads-age','bar', {
      scales: {
        yAxes: [{
          type: "linear",
          ticks: {
              max: 8,
              min: 0,
          }
        }]
      }
    }
  );
});
$.getJSON('/updateCharts?name=leadsByRevenue', function(results) {
  updateChartUI(results.data, 'bar-by-leads-revenue','bar', {
      scales: {
        yAxes: [{
          type: "linear",
          ticks: {
              max: 30000,
              min: 0,
          }
        }]
      }
    }
  );
});
$.getJSON('/updateCharts?name=leadsByKeyRevenue', function(results) {
  updateChartUI(results.data, 'bar-by-leads-key-revenue','bar', {
      scales: {
        yAxes: [{
          type: "linear",
          ticks: {
              max: 30000,
              stepSize: 5000,
              min: 0,
          }
        }]
      }
    }
  );
});
