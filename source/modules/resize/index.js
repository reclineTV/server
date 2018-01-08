const fs = require('fs');
const resizeImg = require('resize-img');


module.exports = app => {
	
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