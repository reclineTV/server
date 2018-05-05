var dgram = require('dgram');

module.exports=app => {
	
	var wakePort = 987;
	
	class ps4{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		/* Wakes up a PS4 */
		wake(){
			// console.log('Wakey wakey bro!');
			
			return new Promise((success, reject) => {
				
				// The wakeup message:
				var message = "WAKEUP * HTTP/1.1\nclient-type:vr\nauth-type:R\nmodel:w\napp-type:r\nuser-credential:" + 
					this.settings.userCredential + "\ndevice-discovery-protocol-version:00020020\n";
				
				// Must be a buffer to send it over UDP:
				var bufferMessage = new Buffer(message);

				// Off it goes!
				var client = dgram.createSocket('udp4');
				client.send(bufferMessage, 0, bufferMessage.length, wakePort, this.settings.address, function(err, bytes) {
					if (err) {
						reject(err);
						return;
					}
					client.close();
					success();
				});
			});
		}
		
	}
	
	// Apply the PS4 config:
	if(app.settings.consoles && app.settings.consoles.ps4){
		
		if(!app.consoles){
			app.consoles = {};
		}
		
		// Instance each one now:
		app.consoles.ps4 = app.settings.consoles.ps4.map(settings => new ps4(settings));
		
	}
	
};