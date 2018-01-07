var Transcoder = require('stream-transcoder');

module.exports = app => {
	
	/*
		Returns a promised stream for a particular video, identified by either its:
		* Media ID {id: NUMBER}
		* ID and provider ref {id: 'PROVIDER_REF/MEDIA_REF'}
		* An object {provider: 'PROVIDER_REF', id: 'MEDIA_REF'}
		
	*/
	app.stream = options => {
		
		return new Promise((success, failed) => {
			
			if(options.provider){
				
				// {provider: 'PROVIDER_REF', id: 'MEDIA_REF'}
				loadStream(options.provider, options.id, options, success, failed);
				
			}else if(options.id.length && options.id.indexOf('/') != -1){
				
				// {id: 'PROVIDER_REF/MEDIA_REF'
				var parts = options.id.split('/',2);
				loadStream(parts[0], parts[1], options, success, failed);
				
			}else{
				
				// Media row ID:
				app.database.query(
					'select url from media where id=?',
					[options.id],
					(err, res) => {
						if(err || !res.length){
							failed('Media row not found with ID "' + options.id + '"');
							return;
						}
						
						// Load it now:
						var mediaRow = res[0];
						var urlParts = mediaRow.url.split('://', 2);
						loadStream(urlParts[0], urlParts[1], options, success, failed);
					}
				);
				
			}
			
		});
		
	};
	
	// Loads a stream from a particular provider, checking/ updating the cache.
	function loadStream(providerRef, mediaRef, options, success, failed){
		
		// Get the provider:
		var providers = app.search[providerRef];
		
		if(!providers){
			failed('Provider "' + providerRef + '" was not found.');
			return;
		}
		
		// Find the correct provider instance (use the first one to map it):
		var provider = providers[0];
		
		if(provider.findProvider){
			// Find the correct provider to use:
			var findResults = provider.findProvider(providers, mediaRef);
			
			if(findResults){
				if(findResults.provider){
					provider = findResults.provider;
				}
				
				if(findResults.mediaRef){
					mediaRef = findResults.mediaRef;
				}
			}
		}
		
		// Does this provider allow caching? If so, try to hit its cache first.
		
		// Wait for the stream to be available:
		return Promise.resolve(provider.stream(mediaRef, options))
			// Then transcode it:
			// .then(info => { info.stream = app.transcode(info.stream); info.contentType='video/mp4'; return info; })
			// Then pass it to the success function:
			.then(info => success(info))
			// Or if it failed, call the fail method:
			.catch(failed);
	}
	
};