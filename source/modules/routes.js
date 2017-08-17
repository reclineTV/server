var glob = require('glob');

module.exports = recline => {
	
	/* Collects the available endpoints */
	glob("../endpoints/**/*.js", {}, function (er, files) {
		files.forEach(console.log); 
	});
	/*
	recline.get('/v1/', require('./endpoints/v1/index')(recline));
	recline.get('/v1/user/start', require('./endpoints/v1/user/start')(recline));
	recline.post('/v1/user/login', require('./endpoints/v1/user/login')(recline));
	*/
}