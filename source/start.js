var reclineCommon = require('recline-common');

// Were we started directly from the command line, or included as part of some other package?
if (require.main === module) {
	// We're being run directly from the command line. Immediately call the startup function.
	reclineCommon({
		loadCommandLine: true,
		server: true
	});
}else{
	// Somebody is including us. Export the function.
	module.exports = startRecline;
}