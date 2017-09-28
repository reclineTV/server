module.exports = app => (request, response) => {
	// Delete media.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('UPDATE media SET deleted=1 where id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('media/notFound');
		}
		
		// Ok!
		response.send({});
	});
	
};