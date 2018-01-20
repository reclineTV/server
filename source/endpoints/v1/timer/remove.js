module.exports = app => (request, response) => {
	// Delete a timer.
	
	const {
		id
	} = request.body;
	
	if(!id){
		return response.error('field/required', ['id']);
	}
	
	if(!request.isRank(app.ranks.NORMAL)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('DELETE from timers WHERE id=?', [id], (err, results) => {
		if(err){
			// E.g. it didn't exist.
			return response.error('timer/notFound', err);
		}
		
		// Ok!
		response.send({});
	});
	
};