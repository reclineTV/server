module.exports = app => (request, response) => {
	// Search media sets.
	
	/*
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	*/
	
	let {
		query,
		parentSet
	} = request.body;
	
	query=(query || '') + '%';
	
	app.database.query('select * from media_sets where `title` like ? and deleted=0 and parentSet ' + (parentSet ? '=?' : 'is null'), [query, parentSet], (err, results) => {
		if(err){
			return response.error('media/error', err);
		}
		
		response.send(results);
		
	});
	
};