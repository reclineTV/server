module.exports = app => (request, response) => {
	// Search people. E.g. find 'Jennifer Lawrence'.
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select * from credited_people where name like ? and deleted=0',
		[query],
		(err, results) => {
			if(err){
				return response.error('media/error', err);
			}
			
			response.send(results);
		}
	);
	
};