module.exports = app => (request, response) => {
	
	// Search devices
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select * from devices where `name` like ?',
		[query],
		(err, results) => {
			response.send(results);
		}
	);
	
};