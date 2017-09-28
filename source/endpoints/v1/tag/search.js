module.exports = app => (request, response) => {
	// List all tags.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('select tag, count(*) as count from media_tags group by tag', [request.user.id], (err, results) => {
		
		response.send(results);
		
	});
	
};