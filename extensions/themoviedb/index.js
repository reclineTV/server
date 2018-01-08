const MovieDb = require('moviedb-promise');
const async = require('async');
const fetch = require("node-fetch");
const fs = require("fs");
const FetchStream = require('fetch').FetchStream;

module.exports=app => {
	
	var config = app.settings.themoviedb;
	
	if(!config || !config.key){
		return;
	}
	
	const moviedb = new MovieDb(config.key);
	
	class themoviedb{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		search(name){
			return moviedb.searchMovie({ query: name });
		}
		
		feelingLucky(name){
			return this.search(name).then(res => res.results.length?res.results[0]:undefined);
		}
		
		detail(movieId){
			// return 
		}
		
		image(imageId){
			return new FetchStream('https://image.tmdb.org/t/p/w2560/'+imageId)
		}
		
	}
	
	// Hook up the movieDB provider as the moviemeta provider:
	app.moviemeta = new themoviedb(config);
	
};