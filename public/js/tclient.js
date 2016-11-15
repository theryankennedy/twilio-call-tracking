
 $.getJSON('/token', function(token) {
	Twilio.Device.setup(token, {'debug':true});
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
	        if (confirm('Accept incoming call from ' + connection.parameters.From + '?')){
	            connection.accept();
	        } 
	        else {
	            connection.reject();
	        }
        });
	  	//Twilio.Device.incoming(function(connection) {
  		//connection.accept();   // call is in progress, chat away!
  		// updating our call() function
	});	
});
