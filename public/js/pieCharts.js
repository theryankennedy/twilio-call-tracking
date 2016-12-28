
function updateChartUI(data, selectorId, type) {
  if (type === undefined) {
    type = 'polarArea';
  }
  var chartContext = $("#" + selectorId).get(0).getContext("2d");
  var theChart = new Chart(chartContext, {type: type , data: data.dataArray});
}

// init sync
$.getJSON('/synctoken', function(results) {
  var client = new Twilio.Sync.Client(results.token);

  // listen for updates
  client.document("callsByCallSource").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log('updating');
      updateChartUI(updatedResults, 'pie-by-call-source');
    });
  });
  client.document("callsByCity").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-city');
    });
  });
  client.document("callsByState").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-state');
    });
  });
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
      updateChartUI(updatedResults, 'bar-by-leads-age', 'bar');
    });
  });
});

// init the charts on page load
$.getJSON('/updateCharts?name=callsByCallSource', function(results) {
  updateChartUI(results.data, 'pie-by-call-source');
});
$.getJSON('/updateCharts?name=callsByCity', function(results) {
  updateChartUI(results.data, 'pie-by-city');
});
$.getJSON('/updateCharts?name=callsByState', function(results) {
  updateChartUI(results.data, 'pie-by-state');
});
$.getJSON('/updateCharts?name=leadsByState', function(results) {
  updateChartUI(results.data, 'pie-by-leads-state');
});
$.getJSON('/updateCharts?name=leadsByGender', function(results) {
  updateChartUI(results.data, 'pie-by-leads-gender');
});
$.getJSON('/updateCharts?name=leadsByAge', function(results) {
  updateChartUI(results.data, 'bar-by-leads-age','bar');
});
