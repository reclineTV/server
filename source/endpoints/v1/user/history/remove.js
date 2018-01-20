module.exports = app => (request, response) => {
	// Delete a history entry.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('UPDATE history set deleted=1 where id=? and userId=?', [id, request.user.id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('history/notFound', err);
		}
		
		// Ok!
		response.send({});
	});
	
};