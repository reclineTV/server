module.exports = app => (request, response) => {
	// Update or create clients.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		name,
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('clients', {
		id,
		name,
		created
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('client/failed');
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
};