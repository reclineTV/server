module.exports = app => (request, response) => {
	// List user's history.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('select id, created, contentId, contentType from history where userId=? and deleted=0', [request.user.id], (err, results) => {
		
		response.send(results);
		
	});
	
};