const ytdl = require("ytdl-core");
const fetch = require("node-fetch");
const rdpjs = require("node-rdpjs");

module.exports=app => {
	
	class rdp{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		/* Part of the provider API - pings a provider to see if it's currently available */
		ping() {
		}
		
		/* Opens a stream for the given provider-specific content ID */
		stream(id, options) {
			// ID is the desktop IP
			options = options || {};
			
			var client = rdpjs.createClient({ 
				domain : this.settings.domain, 
				userName : options.username || this.settings.username,
				password : options.password || this.settings.password,
				enablePerf : true,
				autoLogin : true,
				decompress : false,
				screen : { width : 800, height : 600 },
				locale : 'en',
				logLevel : 'INFO'
			}).on('connect', function () {
				//console.log("connect");
			}).on('close', function() {
				//console.log("close");
			}).on('bitmap', function(bitmap) {
				//console.log("bitmap data");
			}).on('error', function(err) {
				//console.log("RDP error", err);
			}).connect(id, options.port || this.settings.port || 3389);
			
			return {
				stream: null,
				contentType: 'video/mp4'
			};
		}
		
	}
	
	// Hook up the rdp provider:
	app.providers.rdp = rdp;
	
};