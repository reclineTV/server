module.exports = app => (request, response) => {
	
	// Set the user cookie in the past:
	response.cookie('user','', {
		maxAge: -10000,
		httpOnly: true
	});
	
	// JSON output:
	response.send({
		message: 'Bye!'
	});
	
};