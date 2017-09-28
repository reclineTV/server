module.exports = app => (request, response) => {
	// Delete a media tag.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('DELETE from media_tags where id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('tag/notFound');
		}
		
		// Ok!
		response.send({});
	});
	
};