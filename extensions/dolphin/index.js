var exec = require('child_process').exec;

module.exports=app => {
	
	if(!app.settings.dolphin){
		return;
	}
	
	// Path to the dolphin exec:
	var dolphinExec = app.settings.dolphin.path;
	
	/*
	Dolphin - the amazing Wii/ GameCube Emulator
	*/
	class dolphin{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		start(media, options) {
			// Must be a file provider only:
			if(!media.getFileInfo){
				throw new Error('Dolphin can only play ISO\'s from your media library (the provider must have a "getFileInfo" method).');
			}
			
			// Get the raw path to the ISO:
			var isoPath = media.getFileInfo({original: true}).filePath;
			
			return new Promise((success, reject) => {
				
				// Start it up:
				exec('"' + dolphinExec + '" -e "' + isoPath + '"', function callback(error, stdout, stderr){
					if(error){
						return reject(error);
					}
					// result
					success({
						stdout,
						stderr,
						input: null, // Input stream
						stream: null // Video stream
					});
				});
				
			});
		}
		
	}
	
	// Hook up the Dolphin emulator:
	app.emulators.gamecube = app.emulators.wii = new dolphin();
	
};