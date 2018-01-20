module.exports = app => (request, response) => {
	// All tags on a particular media.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	const {
		mediaId
	} = request.body;
	
	app.database.query('select id, tag from media_tags where mediaId=?', [mediaId], (err, results) => {
		if(err){
			return response.error('media/error', err);
		}
		
		response.send(results);
		
	});
	
};