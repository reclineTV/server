var exec = require('child_process').exec;

module.exports=app => {
	
	if(!app.settings.epsxe){
		return;
	}
	
	// Path to the epsxe exec:
	var epsxeExec = app.settings.epsxe.path;
	
	/*
	epsxe - the amazing PS1 Emulator
	*/
	class epsxe{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		start(media, options) {
			// Must be a file provider only:
			if(!media.getFileInfo){
				throw new Error('epsxe can only play ISO\'s from your media library (the provider must have a "getFileInfo" method).');
			}
			
			// Get the raw path to the ISO:
			var isoPath = media.getFileInfo({original: true}).filePath;
			
			return new Promise((success, reject) => {
				
				// Start it up:
				console.log('"' + epsxeExec + '" -nogui -loadbin "' + isoPath + '"');
				exec('"' + epsxeExec + '" -nogui -loadbin "' + isoPath + '"', function callback(error, stdout, stderr){
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
	
	// Hook up the epsxe emulator:
	app.emulators.ps1 = new epsxe();
	
};