module.exports = app => (request, response) => {
	
	// Search clients users
	
	if(!request.user){
		return response.error('action/notAuthorized');
	}
	
	let {
		query
	} = request.body;
	
	query = (query || '') + '%';
	
	app.database.query(
		'select client_users.* from client_users left join users on client_users.userId = users.id where `displayName` like ?',
		[query],
		(err, results) => {
			response.send(results);
		}
	);
	
};