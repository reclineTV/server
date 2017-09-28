module.exports = app => (request, response) => {
	// Delete a client user.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('DELETE FROM client_users WHERE id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('clientUser/notFound');
		}
		
		// Ok!
		response.send({});
	});
	
};