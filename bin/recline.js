#!/usr/bin/env node

var process = require('process');
var path = require('path');

// The working dir where recline was invoked:
var calledFromPath = process.cwd();

// Change to the Recline dir:
process.chdir(path.dirname(__filename) + '/../');

require('../source/start.js')({
	loadCommandLine: true,
	server: true,
	calledFromPath
});
