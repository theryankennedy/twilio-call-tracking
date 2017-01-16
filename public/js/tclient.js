
 $.getJSON('/token', function(response) {

   console.log('hello');

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

          // show lead information
          $("#Adgroup").html();
          $("#Keyword").html();

          $("#PhoneNumber").html(lead.callerNumber);
          $("#LeadName").html(lead.callerName);
          $("#City").html(lead.city);
          $("#State").html(lead.state);
          $("#Gender").html(lead.gender);
          $("#Age").html(lead.age);
        

          // update table and show lead information
          $("#active-call #lead-table").append("<tr><td>"+lead.callerNumber+'</td><td>'+lead.callerName+'</td><td>'+lead.city+'</td><td>'+lead.state+'</td><td>'+lead.gender+'</td><td>'+lead.age+'</td><td>blank</td><td><input type="checkbox" id="cbox1"><br>Yes</td><td><input type="text" name="LeadRevenue" id="revenue"></td><td>Residential</td><td>Large - 4 rooms</td><td>Rodents observed</td><td>Critical</td></tr>');
          
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


