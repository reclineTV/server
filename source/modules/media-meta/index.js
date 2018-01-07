var ffprobe = require('ffprobe');
 

module.exports = app => {
	
	/*
	* A duration in seconds
	*/
	app.convertDuration = duration => {
		if(duration && duration.indexOf && duration.indexOf(':') != -1){
			// Assuming ffmeg hh:mm:ss.fff format
			var segments = duration.split(':');
			
			var factorial = 1;
			var total = 0;
			for(var i=segments.length-1;i>=0;i--){
				total += parseFloat(segments[i]) * factorial;
				factorial *=60;
			}
			return total;
			
		}
		return parseFloat(duration);
	}
	
	app.getMetadata = filepath => ffprobe(filepath, {path: 'ffprobe'}).then(meta => {
		
		// Add a duration to the metadata if we don't have one:
		if(!meta.duration && meta.streams){
			
			for(var i=0;i<meta.streams.length;i++){
				var stream = meta.streams[i];
				if(stream.duration){
					meta.duration = parseFloat(stream.duration);
					break;
				}else if(stream.tags){
					if(stream.tags.DURATION){
						// Parse from the tags:
						meta.duration = app.convertDuration(stream.tags.DURATION);
					}
				}
			}
			
		}
		
		return meta;
	})
};