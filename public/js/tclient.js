
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
        console.log('yoyoyo');
        $.get('/getleadbynumber/'+connection.parameters.From , function(lead){
          //console.log(lead);
          // update table and show lead information
          $("#active-call #lead-table").append("<tr><td>"+lead.callerNumber+'</td><td>'+lead.callerName+'</td><td>'+lead.city+'</td><td>'+lead.state+'</td><td>'+lead.gender+'</td><td>'+lead.age+'</td><td>blank</td><td><input type="checkbox" id="cbox1"><br>Yes</td><td><input type="text" name="LeadRevenue" id="revenue"></td></tr>');
          $( "#savebutton" ).click(function() {
            var params = {
              qualified: $("#cbox1").val(),
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
                  alert('Success');
              },
              error: function (err){
                  alert('Error');
              } 
            });
          });
          
          if (confirm('Accept incoming call from ' + connection.parameters.From + '?')){
            connection.accept();
          }
          else {
              connection.reject();
          }
        });
      });

	});

});
