#!/usr/bin/env node

var service = require ("os-service");
var process = require('process');
var path = require('path');

// The working dir where recline was invoked:
var calledFromPath = process.cwd();

// Change to the Recline dir:
process.chdir(path.dirname(__filename) + '/../');

require('../source/start.js')({
	loadCommandLine: true,
	calledFromPath
});

// Also make sure auto start is setup:
service.add ("recline", {
	programPath: "recline"
}, function(error){
	if(error){
		console.log('Unable to add Recline as a service', error);
	}
});
