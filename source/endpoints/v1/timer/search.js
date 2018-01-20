module.exports = app => (request, response) => {
	
	// Search timers
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select * from timers where `name` like ?',
		[query],
		(err, results) => {
			if(err){
				return response.error('media/error', err);
			}
			
			response.send(results);
		}
	);
	
};