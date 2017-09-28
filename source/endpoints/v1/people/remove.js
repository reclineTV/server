module.exports = app => (request, response) => {
	// Delete a person.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('UPDATE credited_people SET deleted=1 WHERE id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('credit/notFound');
		}
		
		// Ok!
		response.send({});
	});
	
};