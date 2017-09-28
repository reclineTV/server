var glob = require('glob');

module.exports = app => {
	
	// Express - the webserver helper library - is at app.express:
	var express = app.express;
	
	/* Autorouter - Collects the available endpoints */
	glob("source/endpoints/**/*.js", {}, (er, files) => {
		
		// For each endpoint we've found..
		files.forEach(path => {
			
			// The URL to use - if it's "index.js" then drop the whole word and the /. Otherwise, just drop .js from the end:
			var target = path.endsWith("index.js") ? path.substring(0, path.length - 9) : path.substring(0, path.length - 3);
			
			// Remove 'source/endpoints':
			target = target.substring('source/endpoints'.length);
			
			// Get (and setup) the module now. The request method expects (request, response) - the standard express handler:
			var requestMethod = require('../../' + path)(app);
			
			var requestMethodWithAuth = (req, resp) => {
				
				// Also append the error helper:
				resp.error = message => resp.status(400).send({type: message});
				
				// Load the current user:
				app.loadUser(req, user => {
					// Run the request method now:
					requestMethod(req, resp);
				});
				
			}
			
			// Setup all endpoints for both get and post:
			express.get(target, requestMethodWithAuth);
			express.post(target, requestMethodWithAuth);
			
			if(target.endsWith('/update')){
				// Alias as '/add' too:
				var addTarget = target.replace('/update', '/add');
				express.get(addTarget, requestMethodWithAuth);
				express.post(addTarget, requestMethodWithAuth);
			}
			
			console.ok('Added route', target);
			
		}); 
		
		// Add error handlers next.
		
		// Converts a missing endpoint into a pretty JSON 404.
		var err = (req, res) => {
			res.status(404).send({
				type: 'action/notfound'
			});
		};
		
		// Catch all for any missing responses:
		express.get('*', err).post('*', err);
		
	});
	
}