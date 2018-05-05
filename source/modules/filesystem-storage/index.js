var fs = require('fs');
var parseRange = require('range-parser');


module.exports=app => {	
	
	// When a range header is provided, this restricts the max payload size.
	// It essentially stops low RAM clients from blowing their memory limit, 
	// as they'll tend to request the entire file.
	var MAX_RANGE_SIZE = 5 * 1024 * 1024;
	
	class fileSystem{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		/* Part of the provider API - pings a provider to see if it's currently available */
		ping() {
			// Assume to be always available:
			return Promise.resolve(true);
		}
		
		findProvider(providers, mediaRef) {
			// Find the correct provider to use - mediaRef will be e.g. A/1 which will use the 'file' provider with name 'A':
			var fileParts = mediaRef.split('/', 2);
			
			return {
				provider: providers.find(provider => provider.name == fileParts[0]),
				mediaRef: fileParts[1]
			};
		}
		
		/*
			Gets the filepath and contentType for the given media ID and options.
			Provide options.webm (bool) and options.original (bool) to define if it should respond with a webm file/ the original.
		*/
		getFileInfo(id, options) {
			
			// Make it consistent:
			id = id.replace('\\', '/');
			
			// Get the type and also the path without the type:
			var lastDot = id.lastIndexOf('.');
			var filePathWithoutType = id.substring(0, lastDot);
			var fileType = id.substring(lastDot + 1);
			
			var file;
			var contentType = null;
			
			if(options.webm){
				file = 'vp9-opus.webm';
				contentType = 'video/webm';
			}else if(options.original){
				file = 'original.' + fileType;
				contentType = app.mime.lookup(fileType);
			}else{
				contentType = app.mime.lookup(fileType);
				
				if(contentType.indexOf('audio') != -1){
					// Audio files - just use the original one:
					file = 'original.' + fileType;
				}else{
					file = 'h264-aac.mp4';
					contentType = 'video/mp4';
				}
			}
			
			// Path:
			var filePath = this.settings.path + '/' + filePathWithoutType + '/' + file;
			
			return {
				contentType,
				filePath
			};
		}
		
		/* Opens a stream for the given provider-specific content ID */
		stream(id, options) {
			
			options = options || {};
			
			var info = this.getFileInfo(id, options);
			
			// Use a promise so we can wait for the stream to be ready to read
			return new Promise((success, reject) => {
				
				fs.stat(info.filePath, (statErr, stats) => {
					
					if(statErr){
						return reject(statErr);
					}
					
					var readOptions = {};
					
					if(options.range){
						var ranges = parseRange(stats.size, options.range);
						
						if(ranges.type == 'bytes'){
							readOptions.start = ranges[0].start;
							readOptions.end = ranges[0].end;
							
							// Restrict to 5mb chunks (supporting low RAM clients):
							if((readOptions.end - readOptions.start) > MAX_RANGE_SIZE){
								// Range is too big - restrict it:
								readOptions.end = readOptions.start + MAX_RANGE_SIZE;
							}
							
						}
					}
					
					// Open it as a readable stream:
					var readStream = fs.createReadStream(info.filePath, readOptions);

					// Wait until it's valid:
					readStream.on('open', function () {
						// Resolve:
						success(
							{
								stream: readStream,
								length: stats.size,
								range: options.range ? readOptions : undefined,
								contentType: info.contentType
							}
						);
					});
					
					readStream.on('error', reject);
				});	
			});
			
		}
		
	}
	
	// Hook up the file provider:
	app.providers.file = fileSystem;
	
};