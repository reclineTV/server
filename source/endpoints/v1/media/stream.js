module.exports = app => (request, response) => {
	// Streams media.
	
	/*
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	*/
	
	let {
		provider,
		id
	} = request.body;
	
	if(!provider && !id){
		provider = request.query.provider;
		id = request.query.id;
	}
	
	try{
		
		// Stream now:
		app.stream({
			provider,
			id
		}).then(info => {
			response.type(info.contentType);
			info.stream.pipe(response);
		});
		
	}catch(e){
		// Doesn't exist. Error:
		console.log(e);
		return response.error('stream/notFound');
	}
};