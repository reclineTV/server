module.exports = app => (request, response) => {
	// Search credits. E.g. find all media featuring person x.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		mediaId,
		personId
	} = request.body;
	
	// Provide either mediaId or personId
	app.database.query(
		'select * from credits where mediaId=? or personId=?',
		[mediaId, personId],
		(err, results) => {
			if(err){
				return response.error('media/error', err);
			}
			
			response.send(results);
		}
	);
	
};