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
// but if you're looking to make visual changes to Recline, stop!
// Go to the user interface repository instead.

// Step 1. Include web server (Express):
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Include the module loader - it allows Recline to be easy to extend:
var moduleLoader = require('./modules/module-loader');

// The startup function. A user optionally provides the config into this.
function startRecline(settings) {
	
	// Setup express (the web server):
	var expressHttp = express();
	expressHttp.use(logger('dev'));
	expressHttp.use('/', express.static('./public'));
	expressHttp.use(bodyParser.json());
	expressHttp.use(bodyParser.urlencoded({ extended: true }));
	expressHttp.use(cookieParser());
	
	var app = {
		express: expressHttp,
		mime: express.static.mime,
		/* The available search providers, indexed by name.
		   Each one can be instanced multiple times based on settings. The instances end up as app.search */
		providers: {},
		
		/*
			The instanced search providers, indexed by name. Each entry is an array (usually of 1).
			This is such that e.g. if you have multiple local computers, you can search all of them at once.
			Or if you have multiple enigma2 TV receivers, the search can be sent to just one of them.
			I.e. the way search is distributed becomes something the provider can define.
		*/
		search: {}
	};
	
	// Step 2. Load the config. Using Object.assign here so we can essentially overwrite 
	// defaults with the optional config being passed in.
	app.settings = Object.assign(settings || {}, require('../configAndData/settings-default.js'));
	
	// Return a promise so the caller can know when recline is ready to go:
	return new Promise((success, failed) => {
		
		// Step 3. Fire up core modules (this includes registering the API routes):
		moduleLoader.load('./modules', app)
		
		// Step 4. Fire up any extensions:
		.then(() => moduleLoader.load('./extensions', app))
		
		// Step 5. Setup the search providers - these are the core of Recline.
		// We basically send each search to all "providers" - things like Youtube, local content or Netflix - 
		// to find all relevant results in one spot.
		
		.then(() => {
			
			// Get the config, or an empty array:
			var providers = app.settings.providers || [];
			
			if(providers && providers.length === undefined){
				// Actually just one provider - put it in an array for consistency:
				providers = [providers];
			}
			
			if(!providers || !providers.length){
				console.notice(
					'There\'s no search providers in your settings ' + 
					'which means Recline\'s search can\'t do anything. ' + 
					'Here\'s the config that Recline is currently trying to use (the property it\'s looking for is "providers"):\r\n',
					app.settings
				);
				return;
			}
			
			// Instance each provider:
			var promises = providers.map((providerSettings, index) => {
				
				// It must exist and have a 'type' property:
				if(!providerSettings || (typeof providerSettings.type) !== 'string'){
					console.notice(
						'Ignored config for a Recline search provider (index #'+index+' in your settings). ' + 
						'It needs to exist and have a "type" property:\r\n',
						providerSettings
					);
					return;
				}
				
				// Try to get the provider named with the given type..
				var provider = app.providers[providerSettings.type];
				
				if(!provider){
					// Doesn't exist! Give debug info:
					console.notice(
						'Ignored search provider config (index #'+index+' in your settings json) ' + 
						'because "' + providerSettings.type + '" wasn\'t found as a search provider. '+
						'You can add providers by creating an extension which adds itself to app.providers '+
						'(check out the built in search providers for examples). '+
						'Here\'s all of your available providers just in case the type is spelt wrong:\r\n',
						Object.keys(app.providers)
					);
					return;
				}
				
				// It exists! Try instancing it with our config:
				try{
					var providerInstance = new provider(providerSettings);
					
					// Run start if it has one - it can optionally return a promise:
					var prom = providerInstance.start && providerInstance.start();
					
					// Add to active search providers:
					if(!app.search[providerSettings.type]){
						app.search[providerSettings.type] = [];
					}
					
					app.search[providerSettings.type].push(providerInstance);
					
					return prom;
					
				}catch(e){
					// Oh no! The provider failed to start:
					console.fail(
						'Starting the "' + providerSettings.type + '" search provider failed using the following settings '+
						'(provider index #' + index + ' in your settings json). We\'ll ignore it and carry on starting. '+
						'The full error follows the settings:\r\n',
						providerSettings,
						e
					);
				}
			});
			
			// Wait for all of them to start up:
			return Promise.all(promises);
		})
		
		// Step 6. Start listening for web traffic!
		.then(() => {
			
			// Listen on the configured port:
			expressHttp.listen(app.settings.port);
			
			console.ok('Recline started');
			success(app);
		})
		
		// Pass errors through to parent:
		.catch(failed);
		
	});
};


// Were we started directly from the command line, or included as part of some other package?
if (require.main === module) {
	// We're being run directly from the command line. Immediately call the startup function.
	startRecline();
}else{
	// Somebody is including us. Export the function.
	module.exports = startRecline;
}
