var Transcoder = require('stream-transcoder');

module.exports = app => {
	
	/*
		Returns a promised chunk of media metadata for the given reference, which can be:
		* Media ID {id: NUMBER}
		* ID and provider ref {id: 'PROVIDER_REF/MEDIA_REF'}
		* An object {provider: 'PROVIDER_REF', id: 'MEDIA_REF'}
	*/
	app.getMedia = options => {
		
		return new Promise((success, failed) => {
			
			if(options.provider){
				
				// {provider: 'PROVIDER_REF', id: 'MEDIA_REF'}
				loadMeta(options.provider, options.id, options, success, failed, {});
				
			}else if(options.id.length && options.id.indexOf('/') != -1){
				
				// {id: 'PROVIDER_REF/MEDIA_REF'
				var parts = options.id.split('/',2);
				loadMeta(parts[0], parts[1], options, success, failed, {});
				
			}else{
				
				// Media row ID:
				app.database.query(
					'select url, platform from media where id=?',
					[options.id],
					(err, res) => {
						if(err || !res.length){
							failed('Media row not found with ID "' + options.id + '"');
							return;
						}
						
						// Load it now:
						var mediaRow = res[0];
						var urlParts = mediaRow.url.split('://', 2);
						loadMeta(urlParts[0], urlParts[1], options, success, failed, mediaRow);
					}
				);
				
			}
			
		});
		
	}
	
	/*
		Returns a promised stream for a particular video, identified by any media reference (see getMedia).
	*/
	app.stream = options => {
		
		// Get the media meta, then stream from the provider.
		return app.getMedia(options).then(media => Promise.resolve(media.provider.stream(media.mediaRef, options)));
		
	};
	
	// Loads media meta from a particular provider, checking/ updating the cache.
	function loadMeta(providerRef, mediaRef, options, success, failed, extendedMeta){
		
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
		
		// Ok!
		success({
			...extendedMeta,
			provider,
			mediaRef,
			getFileInfo: optionOverrides => provider.getFileInfo(mediaRef, optionOverrides || options)
		});
	}
	
};