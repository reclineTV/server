var Transcoder = require('./transcoder.js');
var recursive = require("recursive-readdir");
var tempfile = require("tempfile");
var fs = require("fs");
var async = require("async");

module.exports = app => {
	
	/*
		Transcodes the given (video) stream such that all content stored in recline is the same format.
		Can be turned off such that no transcoding happens via {mode: 'none'} 
		but target devices must then support all the formats you stream.
		The default is to transcode to h264/aac in an mp4 container.
	*/
	app.transcode = (streamOrFile, settings) => {
		
		var options = settings || app.settings.transcoding || {};
		
		if(options.mode == 'none'){
			return streamOrFile;
		}
		
		if(!options.video){
			options.video={};
		}
		
		if(!options.audio){
			options.audio={};
		}
		
		if(options.toFile && options.toFile.indexOf('.webm') != -1){
			options.webm = true;
		}
		
		var tc = new Transcoder(streamOrFile)
			// .maxSize(320, 240)
			// .fps(25)
			// .audioBitrate(128 * 1000)
			// .videoBitrate(800 * 1000)
			.videoCodec(options.video.codec || (options.webm ? 'libvpx-vp9' : 'h264'))
			.audioCodec(options.audio.codec || (options.webm ? 'libopus' : 'aac'))
			.sampleRate(options.audio.sampleRate || 44100)
			.channels(options.audio.channels || 2)
			.format(options.outputFormat || (options.webm ? 'webm' : 'mp4'));
		
		if(settings.toFile){
			return tc.writeToFile(settings.toFile);
		}
		return tc.stream();
	};
	
	app.transcodeAllVerify = (directory, settings) => {
		
		var options = settings || {};
		
		if(!options.video){
			options.video={};
		}
		
		if(!options.audio){
			options.audio={};
		}
		
		return new Promise((success, reject) => {
			
			recursive(directory, function (err, files) {
				if(err){
					return reject(err);
				}
				
				// Transcode in series:
				async.mapSeries(files, (file, cb) => {
					
					if(file.indexOf('original.') === -1){
						return cb();
					}
					
					app.transcodeVerify(file, settings).then(cb).catch(console.log);
					
				}, success);
				
			});
			
		});
	};
	
	/*
	* Given an original filepath, verifies the transcoding of the file was successful by checking the durations.
	* If no transcoded targets are specified, h264-aac.mp4 is assumed.
	*/
	app.transcodeVerify = (originalFilePath, settings) => {
		
		var options = settings || {};
		
		if(!options.targets){
			options.targets=[];
		}
		
		if(!options.targets.length){
			options.targets.push('h264-aac.mp4');
		}
		
		originalFilePath = originalFilePath.replace(/\\/gi, '/');
		
		// Verify it:
		return app.getMetadata(originalFilePath).then(metaOriginal => {
			
			var promises = [];
			
			for(var i=0;i<options.targets.length;i++){
				
				// The transcoded file is..
				var tcFile = originalFilePath.substring(0, originalFilePath.lastIndexOf("/")) + '/' + options.targets[i];
				
				// Get its metadata:
				promises.push(new Promise((suc, rej) => {
					app.getMetadata(tcFile).then(metaTC => {
						if(Math.abs(metaTC.duration - metaOriginal.duration) > 2){
							rej('Durations don\'t match: ' + metaTC.duration+ ', ' + metaOriginal.duration + ', ' + tcFile);
						}else{
							suc();
						}
					}).catch(e=>{
						rej('Invalid transcoded metadata when verifying', tcFile, e);
					});
				}));
			}
			
			return Promise.all(promises);
		}).catch(e=>{
			console.log('Invalid original metadata when verifying: ' + file + ', ' + e);
			throw e;
		});
	};
	
	app.transcodeAllFs = (directory, settings) => {
		
		var options = settings || {};
		
		if(!options.video){
			options.video={};
		}
		
		if(!options.audio){
			options.audio={};
		}
		
		return new Promise((success, reject) => {
			
			recursive(directory, function (err, files) {
				if(err){
					return reject(err);
				}
				
				// Transcode in series:
				async.mapSeries(files, (file, cb) => {
					
					if(file.indexOf('h264-aac.') === -1){
						return cb();
					}
					
					// Transcode it:
					app.transcodeFastStart(file).then(cb).catch(reject);
					
				}, success);
				
			});
			
		});
	}
	
	app.transcodeAll = (directory, settings) => {
		
		var options = settings || {};
		
		if(!options.video){
			options.video={};
		}
		
		if(!options.audio){
			options.audio={};
		}
		
		var targetName = 'vp9-opus.webm';
		
		if(!settings.webm){
			// new file path:
			targetName = (options.video.codec || 'h264') + '-' + (options.audio.codec || 'aac') + '.mp4';
		}
		
		return new Promise((success, reject) => {
			
			recursive(directory, function (err, files) {
				if(err){
					return reject(err);
				}
				
				// Transcode in series:
				async.mapSeries(files, (file, cb) => {
					
					if(file.indexOf('original.') === -1){
						return cb();
					}
					
					// Transcode it:
					file = file.replace(/\\/gi, '/');
					
					// Get the type and also the path without the type:
					var lastDot = file.lastIndexOf('.');
					var fileType = file.substring(lastDot + 1);
					
					var newFilePath = file.replace('original.' + fileType, targetName);
					
					// Transcode it:
					app.transcodeFile(file, newFilePath, options).then(cb).catch(reject);
					
				}, success);
				
			});
			
		});
	}
	
	/*
	Moves the moov metadata in an mp4 to the start such that it plays back much faster (especially when streaming).
	*/
	app.transcodeFastStart = filePath => {
		filePath = filePath.replace(/\\/gi, '/');
		var tempPath = filePath.substring(0, filePath.lastIndexOf("/")) + '/' + Date.now() + '.mp4';
		
		return new Promise((success, reject) => {
			var tc = new Transcoder(filePath)._exec(['-movflags','faststart','-c','copy',tempPath])
				.on("exit", function(code, signal){
					// Finished - move the result back if it exists:
					if(code){
						return reject('ffmpeg failed with exit code ' + code);
					}
					
					// Does it exist?
					fs.access(tempPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
						if(err){
						  // Doesn't exist or isn't readable - fail.
						  return reject(err);
						}
						// Replace the original with the newly updated file:
						fs.rename(tempPath, filePath, err => err ? reject(err) : success());
					});
				});
		});
	};
	
	/*
	ffmpeg -i h264-aac.mp4 -movflags faststart  -c copy output.mp4
	*/
	app.transcodeFile = (fromPath, toFile, settings) => {
		
		return new Promise((success, reject) => {
			
			fs.access(toFile, fs.constants.R_OK | fs.constants.W_OK, (err) => {
				if(!err){
				  // Exists - ignore.
				  return success();
				}
				
				// Both are now open - transcode it and pipe to the ws:
				
				app.transcode(fromPath, {...settings, toFile}).then(success).catch(reject);
				
			});
			
		});
	};
	
};