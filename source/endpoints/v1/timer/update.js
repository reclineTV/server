module.exports = app => (request, response) => {
	// Update or create timers.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		title,
		description,
		mediaId,
		titleToRecord,
		blockReplays,
		previousDescription,
		cronSchedule,
		streamId,
		provider,
		duration
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('timers', {
		id,
		title,
		description,
		mediaId,
		titleToRecord,
		blockReplays,
		previousDescription,
		cronSchedule,
		streamId,
		provider,
		duration,
		created
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('timer/failed');
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
};