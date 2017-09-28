module.exports = app => (request, response) => {
	if(!request.user){
		return response.error('user/noCookie');
	}
	
	response.send(app.outputUser(request.user));
};