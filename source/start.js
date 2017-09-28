// ===========================================
// Recline entry point - the magic begins here
//                      __                                ___         ___             _
// ___________ ________/  |_ ___ __    ____   ____     __| _/_ __  __| _/____   _____| |
// \____ \__  \\_  __ \   __<   |  |  /  _ \ /    \   / __ |  |  \/ __ |/ __ \ /  ___/ |
// |  |_> > __ \|  | \/|  |  \___  | (  <_> )   |  \ / /_/ |  |  / /_/ \  ___/ \___ \ \|
// |   __(____  /__|   |__|  / ____|  \____/|___|  / \____ |____/\____ |\___  >____  >__
// |__|       \/             \/                  \/       \/          \/    \/     \/ \/
// ===========================================

// This is the API. It does the bulk of the work for Recline
// but if you're looking to make visual changes to Reclne, stop!
// Go to the user interface repository instead.

// Step 1. Setup web server (Express):
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Include pretty console early so it can start 
// outputting nice messages (The green [OK]) straight away:
require('./modules/prettyConsole');

var expressHttp = express();
expressHttp.use(logger('dev'));
expressHttp.use(bodyParser.json());
expressHttp.use(bodyParser.urlencoded({ extended: true }));
expressHttp.use(cookieParser());

var recline = {
	express: expressHttp
};

// Step 2. Load the config:
recline.settings = require('./settings.js')(recline);

// Step 3. Fire up modules:
require('./modules/database')(recline);
require('./modules/templates')(recline);
require('./modules/email')(recline);
require('./modules/user')(recline);
require('./modules/ranks')(recline);

// require('./modules/transcode')(recline);

// Step 4. Grab the routes - these state which API endpoints are available:
require('./modules/routes')(recline);

// Step 6. Start listening for web traffic!
expressHttp.listen(recline.settings.port);

console.ok('Recline started');