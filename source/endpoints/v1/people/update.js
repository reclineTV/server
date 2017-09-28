module.exports = app => (request, response) => {
	// Update or create credits.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		name,
		biography,
		dateOfBirth,
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	var createdBy = !id ? request.user.id : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('credited_people', {
		id,
		name,
		biography,
		dateOfBirth,
		created,
		createdBy
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('person/failed');
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
	
};