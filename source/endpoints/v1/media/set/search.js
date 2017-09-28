module.exports = app => (request, response) => {
	// Search media sets.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query=(query || '') + '%';
	
	app.database.query('select * from media_sets where `title` like ? and deleted=0', [query], (err, results) => {
		
		response.send(results);
		
	});
	
};