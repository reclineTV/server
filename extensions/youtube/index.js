const ytdl = require("ytdl-core");
const fetch = require("node-fetch");

module.exports=app => {
	
	class youtube{
		
		constructor(settings) {
			this.url = 'https://www.youtube.com/';
			this.settings = settings;
		}
		
		/* Sends a request to Youtube */
		fetch(url, options) {
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
			return {
				stream: ytdl(this.url + 'watch?v=' + id),
				contentType: 'video/mp4'
			};
		}
		
	}
	
	// Hook up the youtube provider:
	app.providers.youtube = youtube;
	
};