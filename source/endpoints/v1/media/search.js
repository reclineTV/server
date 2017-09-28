module.exports = app => (request, response) => {
	// Search media.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query,
		parentSet
	} = request.body;
	
	query=(query || '') + '%';
	
	// Optionally you can provide parentSet. Otherwise this searches through media without a parent.
	app.database.query(
		'select * from media where `title` like ? and deleted=0 and parentSet' + (parentSet ? '=?' : ' is null'),
		[query, parentSet],
		(err, results) => {
			response.send(results);
		}
	);
	
};