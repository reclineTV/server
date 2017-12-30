const fetch = require("node-fetch");

module.exports=app => {
	
	class netflix{
		
		constructor(settings) {
			this.url = 'https://www.netflix.com/';
			this.settings = settings;
			this.ping();
			
		}
		
		/* Sends a request to Netflix */
		fetch(url, options) {
			console.log('Request Netflix');
			return fetch(this.url + url, options);
		}
		
		/* Part of the provider API - pings a provider to see if it's currently available */
		ping() {
			return this.fetch('').then(response => {
				console.log(response);
			});
		}
		
		/* Opens a stream for the given provider-specific content ID */
		stream(id, options) {
			
		}
		
	}
	
	// Hook up the Netflix provider:
	app.providers.netflix = netflix;
	
};