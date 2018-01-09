

module.exports = app => {
	
	/*
		Starts an emulator for the given (game/ program) media.
		{
			id: MEDIA_ID
		}
	*/
	app.emulate = options => {
		return app.getMedia({id: options.id}).then(mediaInfo => {
			
			/*
				Ok - we now have the media info.
				We'll now need the platforms emucode (textual emulator ref).
			*/
			
			return new Promise((success, reject) => {
			
				app.database.query(
					'select * from media_platforms where id=?',
					[mediaInfo.platform],
					(err, results) => {
						var emulator = app.emulators[results[0].emucode];
					
						if(!emulator){
							throw new Error('Emulator for "' + mediaInfo.platform + '" not available (media #' + options.id + '). Have you installed it as an extension?');
						}
						
						// Start the emulator, returning a promise.
						// The promise contains:
						/*
							{
								stream: audio_video_stream, // read this (if exists)
								input: input_stream // write to this (if exists)
							}
						*/
						emulator.start(mediaInfo, options).then(success).catch(reject);
					}
				)
				
			});
		});
	}
	
};