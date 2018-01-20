module.exports = app => (request, response) => {
	// Update or create client users.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		userId,
		clientId,
		isPrimary
	} = request.body;
	
	// Insert/ update now:
	app.database.insertOrUpdate('client_users', {
		id,
		clientId,
		userId,
		isPrimary
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('client/failed', err);
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
};