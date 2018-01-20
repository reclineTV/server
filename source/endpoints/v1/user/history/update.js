module.exports = app => (request, response) => {
	// Update or create a history entry.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		contentId,
		contentType
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	var userId = !id ? request.user.id : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('history', {
		id,
		contentId,
		contentType,
		created,
		userId
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('history/failed', err);
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
	
};