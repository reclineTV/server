const cache = {};
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const allDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
const colors = require('colors');


/*
	Module loader with promise support.
	
	Path can be a node module, e.g. load('jsonfile').
	It can also be a path relative to start.js, like load('./extensions/helloWorld');
	If that path contains a package.json, then it will check it for dependencies and load those first.
	It then loads the path via a normal require call.
	
	If it doesn't contain a package.json, then it will loop through any subdirectories and try to load those.
	
	If a module exports a function, it will run that and pass in a global 'app' instance.
	If that function returns a promise, it will wait for that promise to complete before the module is loaded.
*/

function load(path, app) {
	if(cache[path]) {
		return cache[path].promise;
	}
	
	console.ok && console.ok('Loading module ' + path);
	
	const cacheEntry = cache[path] = {};
	
	return cacheEntry.promise = new Promise((success, reject) => {
		// If path doesn't start with ., it's a node module
		// If it does start with a . then it's a path - check if that path contains a package.json
		// If it does have a package.json then we'll try to load up all its dependencies first.
		if(path.startsWith('.')) {
			// It's a file path - check if we have a package.json by trying to read it:
			
			var filePath = path.replace('./modules', './source/modules');
			
			jsonfile.readFile(filePath + '/package.json',(err, obj) => {
				if (err) {
					// Doesn't exist - loop through any subdirs and attempt to load them:
					if(fs.existsSync(filePath)){
						const dirs = allDirectories(filePath);
						if(!dirs || !dirs.length){
							console.warn(
								'[' + ('Recline package missing'.yellow) + ']. "' + 
								path + '" is missing a package.json or index.js (or both), or the package.json is invalid. We\'re skipping over it. Here\'s the problem it had:\r\n', err
							);
							success();
							return;
						}
						
						Promise.all(dirs.map(dir => load(path + '/' + dir, app))).then(success);
					}else{
						// Non-dir or non-existent. Just warn and ignore it.
						console.warn('Module ' + filePath + ' either doesn\'t exist or isn\'t a directory.');
						success();
						return;
					}
				} else {
					// Got a package.json which loaded up.
					Promise.all(Object.keys(obj.dependencies || {}).map(moduleName => load(moduleName, app))).then(() => {
						// All dependencies loaded. Load the actual package now:
						
						if(filePath == path){
							path = './.' + path;
						}
						
						requireNow('../.' + path, app, success);
					});
				}
			});
			
		} else {
			// Otherwise node package - just include it as-is:
			requireNow(path, app, success);
		}
	});
}

function requireNow(path, app, success) {
	let response = null;
	try{
		const pkg = require(path);
		response = (typeof pkg === 'function') && pkg(app);
	}catch(e){
		console.warn(
			'[' + ('Recline package load failure'.red) + ']. "' + 
			path + '" failed to load, but we\'ll keep trying to start anyway. The path is relative to ' + __filename + '. Here\'s the problem it had:\r\n',
			e
		);
	}
	
	// Complete:
	Promise.resolve(response).then(success);
}

module.exports = {
	cache,
	load
};

// Add this to cache:
cache['./modules/moduleLoader'] = {promise: new Promise((s,r)=>s())};