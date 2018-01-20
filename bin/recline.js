#!/usr/bin/env node

var service = require ("os-service");
var process = require('process');
var path = require('path');
var fs = require('fs');

// The working dir where recline was invoked:
var calledFromPath = process.cwd();

// Change to the Recline dir:
process.chdir(path.dirname(__filename) + '/../');

// Make sure auto start is setup:
service.add ("recline", {
	programPath: "recline"
}, function(error){
	if(error){
		console.log('Unable to add Recline as a service', error);
	}
});

// Start the service now:
var logStream = fs.createWriteStream ("recline.log");

var _app;

require('../source/start.js')({
	loadCommandLine: true,
	calledFromPath
}).then(app => _app = app);

// Use the run line to redirect output to a file and listen for stop requests:
service.run (logStream, function () {
	
	if(_app){
		// _app.express.stop();
	}
	
	service.stop();
});
