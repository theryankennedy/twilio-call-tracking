
function updateChartUI(data, selectorId) {
  var chartContext = $("#" + selectorId).get(0).getContext("2d");
  var theChart = new Chart(chartContext, {type: 'pie', data: data.dataArray});
}

// init sync
$.getJSON('/synctoken', function(results) {
  var client = new Twilio.Sync.Client(results.token);

  // listen for updates
  client.document("leadsByLeadSource").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-lead-source');
    });
  });
  client.document("leadsByCity").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-city');
    });
  });

});

// init the charts on page load
$.getJSON('/updateCharts?name=leadsByLeadSource', function(results) {
  updateChartUI(results.data, 'pie-by-lead-source');
});
$.getJSON('/updateCharts?name=leadsByCity', function(results) {
  updateChartUI(results.data, 'pie-by-city');
});
