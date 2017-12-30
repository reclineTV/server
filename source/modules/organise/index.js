var recursive = require("recursive-readdir");
var fs = require("fs");
var async = require("async");

/*
* Iterates through all episodes in a given array of seasons.
*/
function eachEpisode(seasons, onEpisode, onSpace) {

	for(var i=1;i<seasons.length;i++){
		var season = seasons[i];
		if(!season){
			continue;
		}
		season.number = i;
		for(var e=1;e<season.length;e++){
			var episode = season[e];
			if(!episode){
				onSpace && onSpace();
				continue;
			}
			onEpisode && onEpisode(episode, season);
		}
	}
}

function getFileType(path){
	var bits = path.split('.');
	return bits[bits.length-1];
}

/*
	Makes a dir if it doesn't exist
*/
function ensureExists(path, cb) {
    fs.mkdir(path, 484, function(err) { // 0777
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

module.exports = app => {
	
	/*
		Finds all files in a directory containing the season and episode number such as SxxEyy
		then converts them into the recline structure using the starting ID in the given options.
		e.g. organise('etc/MyTvSeries', {start: 1090, apply: true}).then(seasons => console.log(seasons)); 
		will reorganise the directory such that it contains a collection of
		dirs starting from 1090 (1090, 1091, 1092..) with an episode per directory. Set apply to false to get the computed season list only.
		To be clear: apply=false makes no changes to your files.
	*/
	app.organise = (directory, options) => {
		
		return new Promise((success, reject) => {
			
			recursive(directory, function (err, files) {
				if(err){
					return reject(err);
				}
				
				// For each file, look for both the season and episode numbers:
				var seasonMatcher = options.season || /S(\d+)/i;
				var episodeMatcher = options.episode || /E(\d+)/i;
				
				var seasons = [];
				
				files.forEach(file => {
					var seasonMatches = file.match(seasonMatcher);
					var episodeMatches = file.match(episodeMatcher);
					
					if(seasonMatches && seasonMatches.length>1 && episodeMatches && episodeMatches.length>1){
						var seasonNumber = parseInt(seasonMatches[1]);
						var episodeNumber = parseInt(episodeMatches[1]);
						if(!seasons[seasonNumber]){
							seasons[seasonNumber] = [];
						}
						// Add to the array:
						seasons[seasonNumber][episodeNumber] = {path: file};
					}
				});
				
				// Next, assign IDs:
				if(options.start){
					
					var id = options.start;
					
					// For each episode..
					eachEpisode(seasons, (episode, season) => {
						// Apply the ID and the season number:
						episode.id = id;
						episode.season = season.number;
						episode.directory = directory + '/' + episode.id;
						episode.fileType = getFileType(episode.path);
						episode.newPath = episode.directory + '/original.' + episode.fileType;
						episode.url = 'file://A/' + episode.id + '.' + episode.fileType;
						id++;
					}, () => {
						if(options.leaveSpaces){
							// Missing an episode - leave a space for it:
							id++;
						}
					});
					
				}
				
				if(options.apply){
					// Actually apply the new file structure
					
					// Create an array of episodes (dirs to make):
					var episodes = [];
					eachEpisode(seasons, episode => episodes.push(episode));
					
					// Create the dirs in parallel:
					async.map(episodes, (episode, cb) => ensureExists(episode.directory, cb), function(){
						// Ok - they now all exist! Next rename all the files to their new target:
						
						async.map(episodes, (episode, cb) => fs.rename(episode.path, episode.newPath, cb), function(){
							// return the organised files as seasons:
							success(seasons);
						});
						
					});
					
				}else{
					// return the organised files as seasons:
					success(seasons);
				}
				
			});
			
		});
	};
	
};