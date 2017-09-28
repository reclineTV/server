module.exports = app => (request, response) => {
	// List user's favourites.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('select id, created, mediaId from favourites where userId=? and deleted=0', [request.user.id], (err, results) => {
		
		response.send(results);
		
	});
	
};