module.exports = app => (request, response) => {
	// Delete a media set.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('UPDATE media_sets SET deleted=1 where id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('mediaSet/notFound');
		}
		
		// Ok!
		response.send({});
	});
	
};