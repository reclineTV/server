module.exports = app => (request, response) => {
	// Get media.
	
	let {
		id
	} = request.body;
	
	if(!id){
		id = request.query.id;
	}
	
	// Optionally you can provide parentSet. Otherwise this searches through media without a parent.
	app.database.query(
		'select * from media where id=?',
		[id],
		(err, results) => {
			
			if(err || !results.length){
				return response.error('media/error', err);
			}
			
			response.send(results[0]);
		}
	);
	
};