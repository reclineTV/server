module.exports = app => (request, response) => {
	// Delete an extension.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('DELETE FROM extensions where id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('extension/notFound', err);
		}
		
		// Ok!
		response.send({});
	});
	
};