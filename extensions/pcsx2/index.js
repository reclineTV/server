var exec = require('child_process').exec;

module.exports=app => {
	
	if(!app.settings.pcsx2){
		return;
	}
	
	// Path to the pcsx2 exec:
	var pcsx2Exec = app.settings.pcsx2.path;
	
	/*
	pcsx2 - the amazing PS2 Emulator
	*/
	class pcsx2{
		
		constructor(settings) {
			this.settings = settings;
		}
		
		start(media, options) {
			// Must be a file provider only:
			if(!media.getFileInfo){
				throw new Error('PCSX2 can only play ISO\'s from your media library (the provider must have a "getFileInfo" method).');
			}
			
			// Get the raw path to the ISO:
			var isoPath = media.getFileInfo({original: true}).filePath;
			
			return new Promise((success, reject) => {
				
				// Start it up:
				exec('"' + pcsx2Exec + '" "' + isoPath + '"', function callback(error, stdout, stderr){
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
	
	// Hook up the pcsx2 emulator:
	app.emulators.ps2 = new pcsx2();
	
};