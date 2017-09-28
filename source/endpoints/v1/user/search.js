module.exports = app => (request, response) => {
	// List users (super only).
	
	if(!request.isRank(app.ranks.ADMIN)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('select * from users order by displayName', (err, results) => {
		
		response.send(results.map(app.outputUser));
		
	});
	
};