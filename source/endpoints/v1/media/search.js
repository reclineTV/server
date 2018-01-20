module.exports = app => (request, response) => {
	// Search media.
	
	/*
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	*/
	
	let {
		query,
		parentSet,
		type
	} = request.body;
	
	if(!query){
		app.database.query(
			'select * from media where type=? and deleted=0 and parentContentId is null',
			[type, parentSet],
			(err, results) => {
				if(err){
					return response.error('media/error', err);
				}
				response.send(results);
			}
		);
		return;
	}
	
	query=(query || '') + '%';
	
	// Optionally you can provide parentContentId. Otherwise this searches through media without a parent.
	app.database.query(
		'select * from media where `title` like ? and deleted=0 and parentContentId' + (parentSet ? '=?' : ' is null'),
		[query, parentSet],
		(err, results) => {
			
			if(err){
				return response.error('media/error', err);
			}
			
			response.send(results);
		}
	);
	
};