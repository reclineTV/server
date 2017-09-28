module.exports = app => (request, response) => {
	// Update or create a tag on some media.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		mediaId,
		tag
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	var createdBy = !id ? request.user.id : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('media_tags', {
		id,
		mediaId,
		tag,
		created,
		createdBy
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('tag/failed');
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
	
};