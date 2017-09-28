module.exports = app => (request, response) => {
	// Update or create media. Note that the actual media upload happens separately 
	// (like on Youtube) so this can all be filled in whilst it uploads.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		id,
		parentContentId,
		parentContentType,
		type,
		title,
		ageRating,
		ratingGlobal,
		ratingGlobalUsers,
		duration,
		releaseDate,
		rating,
		description,
		url
	} = request.body;
	
	var created = !id ? new Date() : undefined;
	var createdBy = !id ? request.user.id : undefined;
	
	// Insert/ update now:
	app.database.insertOrUpdate('media', {
		id,
		parentContentId,
		parentContentType,
		type,
		title,
		ageRating,
		ratingGlobal,
		ratingGlobalUsers,
		duration,
		releaseDate,
		rating,
		description,
		url,
		created,
		createdBy
	}, (err, id) => {
		if(err){
			// E.g. because invalid field
			return response.error('media/failed');
		}
		
		// Output the ID:
		response.send({
			id
		});
	});
	
};