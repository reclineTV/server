module.exports = app => (request, response) => {
	// Search uploads. Generally the search feature of this endpoint isn't very useful; most of the time it will just be a lister.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select * from uploads where `path` like ?',
		[query],
		(err, results) => {
			response.send(results);
		}
	);
	
};