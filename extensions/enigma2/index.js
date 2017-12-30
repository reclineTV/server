const fetch = require("node-fetch");
const FetchStream = require('fetch').FetchStream;

module.exports=app => {
	
	class enigma2{
		
		constructor(settings) {
			this.settings = settings;
			
			if(!settings.host){
				settings.host = '127.0.0.1';
			}
			
			settings.url = 'http://' + settings.host + '/';
			
			//const fs = require("fs");
			//app.transcode(this.stream('1:0:1:1E28:809:2:11A0000:0:0:0:')).pipe(fs.createWriteStream('tv-stream-transcoded-potc.mp4'));
		}
		
		/* Sends a request to the enigma2 receiver */
		fetch(url, options) {
			return fetch(this.settings.url + 'api/' + url, options);
		}
		
		/* Part of the provider API - pings a provider to see if it's currently available */
		ping() {
			
			return this.fetch('statusinfo').then(response => {
				console.log(response);
			});
			
		}
		
		/* Part of the provider API - performs a search for the given query with optional extra args, which typically consists of a 'tags' property. */
		search(query, options) {
			
		}
		
		/* Part of the provider API - streams e.g. a TV channel identified by the given ID */
		stream(id, options) {
			return {
				contentType: 'video/mp4',
				stream: new FetchStream('http://' + this.settings.host + ':' + (this.settings.streamPort || 8001) + '/' + id)
			};
		}
		
	}
	
	// Hook up the enigma2 provider:
	app.providers.enigma2 = enigma2;
	
};