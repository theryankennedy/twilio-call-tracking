

$.getJSON('/token', function(response) {

   console.log('hello');
   showAllUiStuff();
   $("#form-data-box").hide();

	  Twilio.Device.setup(response.token);
  	Twilio.Device.ready(function(device) {

  		console.log("Twilio.Device is now ready for connections");

      $( "#callbutton" ).click(function() {
  		  	var params = {"tocall": $("#number").val()};
  		  	Twilio.Device.connect(params);
  		  	console.log(number);

  		});
  		$( "#disconnectbutton" ).click(function() {
  		  	Twilio.Device.disconnectAll();
  		});

    	Twilio.Device.incoming(function (connection) {
        console.log('incoming call');

        // define events for buttons and connection
        $( "#answerbutton" ).click(function() {
          connection.accept();
          $( "#answerbutton" ).hide();
          $(".agent-data-box-input").show();
        });
        $( "#finishbutton" ).click(function() {
          connection.reject();
          connection.disconnect();
        });
        connection.disconnect(function(conn) {
          console.log("the call has ended");
          $(".incoming-call-controls").hide();
          $(".incoming-call-message").html('<p>waiting for call...</p>');
        });

        // show the message and controls
        $(".incoming-call-message").html('<p>incoming call!</p>');
        $( "#answerbutton" ).show();
        $(".incoming-call-controls").show();

        // show data
        $(".data-container").show();

        // grab lead data
        $.get('/getleadbynumber/'+connection.parameters.From , function(lead){
          //console.log(lead);

          var processedLead = {};

          // replace lead info with akshay's info for the webinar
          processedLead.callerNumber = '858-699-0026';
          processedLead.callerName = 'Akshay Bharadwaj';
          processedLead.city = "San Diego";
          processedLead.state = "CA";
          processedLead.gender = "Male";
          processedLead.age = "26";

          // show lead information, hardcoded for webinar
          $("#Campaign").html("OK Pest Control - Feburary 2017");
          $("#Adgroup").html("rats");
          $("#Keyword").html("extermination");

          $("#PhoneNumber").html(processedLead.callerNumber);
          $("#LeadName").html(processedLead.callerName);
          $("#City").html(processedLead.city);
          $("#State").html(processedLead.state);
          $("#Gender").html(processedLead.gender);
          $("#Age").html(processedLead.age);


          // update table and show lead information
          $("#active-call #lead-table").append("<tr><td>"+processedLead.callerNumber+'</td><td>'+processedLead.callerName+'</td><td>'+processedLead.city+'</td><td>'+processedLead.state+'</td><td>'+processedLead.gender+'</td><td>'+processedLead.age+'</td><td>blank</td><td><input type="checkbox" id="cbox1"><br>Yes</td><td><input type="text" name="LeadRevenue" id="revenue"></td><td>Residential</td><td>Large - 4 rooms</td><td>Rodents observed</td><td>Critical</td></tr>');

          $( "#savebutton" ).click(function() {
            var params = {
              qualified: $("#cbox1").prop("checked"),
              revenue: $("#revenue").val()
            };
            console.log(params);
            $.ajax({
              url: '/leads/'+connection.parameters.From,
              type: "PUT",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify(params),
              dataType: "json",
              success: function (msg) {
                  console.log('Success');

                  $(".incoming-call-controls").hide();
                  $(".incoming-call-message").html('<p>waiting for call...</p>');
                  $(".data-container").hide();
                  $(".agent-data-box-input").hide();

                  // clear inputs
                  $("#cbox1").prop("checked", true);
                  $("#revenue").val('');

              },
              error: function (err){
                  console.log('Error'+err);
              }
            });
          });

          /*
          if (confirm('Accept incoming call from ' + connection.parameters.From + '?')){
            connection.accept();
          }
          else {
            connection.reject();
          }
            */
         });

      });

	});

});

function showAllUiStuff() {
  $(".agent-data-box-input").show();
  $(".data-container").show();
  //$("#form-data-box").show();
}

function clearUI() {
  $("#Campaign").html("");
  $("#Adgroup").html("");
  $("#Keyword").html("");

  $("#PhoneNumber").html();
  $("#LeadName").html();
  $("#City").html();
  $("#State").html();
  $("#Gender").html();
  $("#Age").html();

  $("#cbox1").prop("checked", true);
  $("#revenue").val('');
}
