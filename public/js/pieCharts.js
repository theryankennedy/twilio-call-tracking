
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

//Start for one keyword = extermination
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
//End for one keyword extermination


//Start for keyword = diy
client.document("diyByState").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-diy-state');
    });
  });
client.document("diyByGender").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-diy-gender');
    });
  });
client.document("diyByAge").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log(updatedResults);
      updateChartUI(updatedResults, 'bar-by-diy-age', 'bar', {
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
//End for one keyword diy

//Start for keyword = prevention
client.document("preventionByState").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-prevention-state');
    });
  });
client.document("preventionByGender").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      updateChartUI(updatedResults, 'pie-by-prevention-gender');
    });
  });
client.document("preventionByAge").then(function (doc) {
    doc.on("updated",function(updatedResults) {
      console.log(updatedResults);
      updateChartUI(updatedResults, 'bar-by-prevention-age', 'bar', {
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
//End for one keyword prevention
});


// init the charts on page load
$.getJSON('/updateCharts?name=leadsByAdgroup', function(results) {
  updateChartUI(results.data, 'pie-by-leads-adgroup');
});

$.getJSON('/updateCharts?name=leadsByKeyword', function(results) {
  updateChartUI(results.data, 'pie-by-leads-keyword');
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

//start for one keyword = extermination
$.getJSON('/updateCharts?name=leadsByState', function(results) {
  updateChartUI(results.data, 'pie-by-leads-state');
});
$.getJSON('/updateCharts?name=leadsByGender', function(results) {
  updateChartUI(results.data, 'pie-by-leads-gender');
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

//End for one keyword

//start for one keyword = diy
$.getJSON('/updateCharts?name=diyByState', function(results) {
  updateChartUI(results.data, 'pie-by-diy-state');
});
$.getJSON('/updateCharts?name=diyByGender', function(results) {
  updateChartUI(results.data, 'pie-by-diy-gender');
});
$.getJSON('/updateCharts?name=diyByAge', function(results) {
  updateChartUI(results.data, 'bar-by-diy-age','bar', {
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

//End for one keyword diy

//start for one keyword = prevention
$.getJSON('/updateCharts?name=preventionByState', function(results) {
  updateChartUI(results.data, 'pie-by-prevention-state');
});
$.getJSON('/updateCharts?name=preventionByGender', function(results) {
  updateChartUI(results.data, 'pie-by-prevention-gender');
});
$.getJSON('/updateCharts?name=preventionByAge', function(results) {
  updateChartUI(results.data, 'bar-by-prevention-age','bar', {
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

//End for one keyword prevention


