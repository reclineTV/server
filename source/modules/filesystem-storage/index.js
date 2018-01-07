var fs = require('fs');
var parseRange = require('range-parser');


module.exports=app => {	

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
		
		/* Opens a stream for the given provider-specific content ID */
		stream(id, options) {
			
			options = options || {};
			
			// Make it consistent:
			id = id.replace('\\', '/');
			
			// Get the type and also the path without the type:
			var lastDot = id.lastIndexOf('.');
			var filePathWithoutType = id.substring(0, lastDot);
			var fileType = id.substring(lastDot + 1);
			
			var file;
			
			if(options.webm){
				file = 'vp9-opus.webm';
			}else if(options.original){
				file = 'original.' + fileType;
			}else{
				file = 'h264-aac.mp4';
			}
			
			// Path:
			var filePath = this.settings.path + '/' + filePathWithoutType + '/' + file;
			
			// Use a promise so we can wait for the stream to be ready to read
			return new Promise((success, reject) => {
				
				fs.stat(filePath, (statErr, stats) => {
					
					if(statErr){
						return reject(statErr);
					}
					
					var readOptions = {};
					
					if(options.range){
						var ranges = parseRange(stats.size, options.range);
						
						if(ranges.type == 'bytes'){
							readOptions.start = ranges[0].start;
							readOptions.end = ranges[0].end;
						}
					}
					
					// Open it as a readable stream:
					var readStream = fs.createReadStream(filePath, readOptions);

					// Wait until it's valid:
					readStream.on('open', function () {
						// Resolve:
						success(
							{
								stream: readStream,
								length: stats.size,
								range: options.range ? readOptions : undefined,
								contentType: 'mp4' // app.mime.lookup(fileType)
							}
						);
					});
					
					readStream.on('error', function(err) {
						reject(err);
					});
				});	
			});
			
		}
		
	}
	
	// Hook up the file provider:
	app.providers.file = fileSystem;
	
};