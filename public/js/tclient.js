
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
          //if (confirm('Accept incoming call from ' + connection.parameters.From + '?')){
        connection.accept();
          //}
          //else {
          //    connection.reject();
          //}
      });

	});

});
