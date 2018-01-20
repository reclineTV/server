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
	
	if(!id){
		return response.error('stream/idRequired');
	}
	
	try{
		
		// Stream now:
		app.stream({
			provider,
			id,
			range: request.headers.range
		}).then(info => {
			
			response.type(info.contentType);
			if(info.length){
				// The stream has a fixed length, meaning it's also seekable (and can therefore use ranges).
				response.set('Accept-Ranges','bytes');
				
				if(info.range){
					// A range:
					response.status(206);
					response.set('Content-Range','bytes ' + info.range.start + '-' + info.range.end + '/' + info.length);
					response.set('Content-Length', (info.range.end - info.range.start + 1) + '');
				}else{
					// All of it:
					response.set('Content-Length', info.length);
				}
			}
			info.stream.pipe(response);
		}).catch(e => response.error('stream/notFound', e));
		
	}catch(e){
		// Doesn't exist. Error:
		return response.error('stream/notFound', e);
	}
};