module.exports = app => (request, response) => {
	// Search extensions. E.g. find 'Youtube'.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select * from extensions where title like ?',
		[query],
		(err, results) => {
			if(err){
				return response.error('media/error', err);
			}
			
			response.send(results);
		}
	);
	
};