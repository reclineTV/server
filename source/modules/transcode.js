var Transcoder = require('stream-transcoder');
var streamBodyParser = require('stream-body-parser');

module.exports = app => {
	
	var streamParser = new streamBodyParser(app);
	streamParser.process('video/*', (stream, req, next) => {
		
		// Assign it a harddrive/ number:
		// app.database.
		
		new Transcoder(stream)
			// .maxSize(320, 240)
			// .fps(25)
			// .audioBitrate(128 * 1000)
			// .videoBitrate(800 * 1000)
			.videoCodec('h265')
			.audioCodec('libfaac')
			.sampleRate(44100)
			.channels(2)
			.format('mp4')
			.on('finish', function() {
				next();
			})
			.stream().pipe(myGridFSWriteStream);
		
	});
	
};