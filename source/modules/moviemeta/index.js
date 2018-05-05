var recursive = require("recursive-readdir");
var tempfile = require("tempfile");
var fs = require("fs");
var async = require("async");

module.exports = app => {
	
	var NOT_FOUND = 'No movie meta provider has been configured. Themoviedb.org is supported - configure it in your Recline settings file with themoviedb: {key: "your_api_key"}';
	
	/*
	* Loops through all movies in the database and searches for them
	*/
	app.findAllMovieMeta = options => {
		
		return new Promise((success, reject) => {
			
			if(!app.moviemeta){
				return reject(NOT_FOUND);
			}
			
			app.database.query(
				'select * from media where deleted=0 and type=1 and description is null and parentContentId is null',
				[],
				(err, results) => {
					if(err){
						console.log(err);
						return;
					}
					
					async.eachSeries(results, function(result, callback){
						
						if(options && options.onSearch){
							options.onSearch(result);
						}
						
						app.moviemeta.feelingLucky(result.title).then(meta => {
							
							if(!meta){
								if(options && options.onNotFound){
									options.onNotFound(result);
								}
								callback();
								return;
							}
							
							app.database.query(
								'update media set description=?, ratingGlobal=?, ratingGlobalUsers=?, releaseDate=? where id=?',
								[meta.overview, meta.vote_average, meta.vote_count, meta.release_date, result.id],
								(err, updateResults) => {
									if(err){
										reject(err);
										return;
									}
									saveImage(result.id + '-poster.jpg', meta.poster_path)
										.then(() => saveImage(result.id + '-backdrop.jpg', meta.backdrop_path))
										.then(callback);
								}
							)
						});
						
					}, success);
					
				}
			);
		});
	}
	
	function saveImage(fileName, pathName){
		return new Promise((success, rej) => {
			var writeStream = fs.createWriteStream('Images/' + fileName);
			app.moviemeta.image(pathName).pipe(writeStream).on("close", success);
		});
	}
	
};