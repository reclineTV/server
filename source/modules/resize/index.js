const fs = require('fs');
const resizeImg = require('resize-img');
var recursive = require("recursive-readdir");
var async = require("async");


module.exports = app => {
	
	/*
	* Destructively resizes all images in the given directory.
	* -poster.* uses poster settings, and -backdrop.* uses backdrop settings.
	*/
	app.resizeAll = directory => {
		
		return new Promise((success, reject) => {
			recursive(directory, function (err, files) {
				if(err){
					return reject(err);
				}
				
				// Resize in series:
				async.mapSeries(files, (file, cb) => {
					
					// Always save as a jpg:
					var pathParts = file.split('.');
					pathParts[pathParts.length-1] = 'jpg';
					var target = pathParts.join('.');
					
					if(file.indexOf('poster.') != -1){
						// Got a poster - resize it:
						app.resizePoster(file, target).then(cb).catch(reject);
					}else if(file.indexOf('backdrop.') != -1){
						// backdrop - resize it:
						app.resizeBackdrop(file, target).then(cb).catch(reject);
					}else{
						return cb();
					}
					
				}, success);
				
			});
		});
	},
	
	/*
	* Resizes an image using backdrop defaults
	*/
	app.resizeBackdrop = (fromFile, toFile) => app.resizeImage(fromFile, toFile, {width: 1920}),
	
	/*
	* Resizes an image using poster defaults
	*/
	app.resizePoster = (fromFile, toFile) => app.resizeImage(fromFile, toFile, {width: 250}),
	
	/*
	Resizes an image from the given original to the given target size (specified as width and height in options)
	*/
	app.resizeImage = (fromFile, toFile, options) => {
		
		return new Promise((success, reject) => {
			
			fs.readFile(fromFile, (err, data)=>{
				if(err){
					return reject(err);
				}
				
				resizeImg(data, options).then(resized => {
					if(!resized){
						return reject('Unsupported format');
					}
					
					fs.writeFile(toFile, resized, err => {
						if(err){
							return reject(err);
						}
						// Ok!
						success();
					});
				}).catch(reject);
				
			})
			
		});
	}
	
};