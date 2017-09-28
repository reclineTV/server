module.exports = app => (request, response) => {
	// List all media tagged with a particular thing.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	const {
		tag
	} = request.body;
	
	app.database.query('select mediaId from media_tags where tag=?', [tag], (err, results) => {
		
		response.send(results);
		
	});
	
};