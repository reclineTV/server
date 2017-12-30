var Transcoder = require('stream-transcoder');

module.exports = app => {
	
	/*
		Transcodes the given (video) stream such that all content stored in recline is the same format.
		Can be turned off such that no transcoding happens via {mode: 'none'} 
		but target devices must then support all the formats you stream.
		The default is to transcode to h264/aac in an mp4 container.
	*/
	app.transcode = (stream, settings) => {
		
		var options = settings || app.settings.transcoding || {};
		
		if(options.mode == 'none'){
			return stream;
		}
		
		if(!options.video){
			options.video={};
		}
		
		if(!options.audio){
			options.audio={};
		}
		
		return new Transcoder(stream)
			// .maxSize(320, 240)
			// .fps(25)
			// .audioBitrate(128 * 1000)
			// .videoBitrate(800 * 1000)
			.videoCodec(options.video.codec || 'h264')
			.audioCodec(options.audio.codec || 'aac')
			.sampleRate(options.audio.sampleRate || 44100)
			.channels(options.audio.channels || 2)
			.format(options.outputFormat || 'mp4')
			.stream();
	};
	
};