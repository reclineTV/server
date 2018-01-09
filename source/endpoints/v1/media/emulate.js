module.exports = app => (request, response) => {
	// Starts an emulator for the given media by ID.

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
	
	if(!id){
		return response.error('stream/idRequired');
	}
	
	try{
		
		// Stream now:
		app.emulate({
			id
		}).then(info => {
			response.send({success: true});
		}).catch(e => {
			console.log(e);
			response.error('stream/notFound')
		});
		
	}catch(e){
		// Doesn't exist. Error:
		console.log(e);
		return response.error('stream/notFound');
	}
};