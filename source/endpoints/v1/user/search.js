module.exports = app => (request, response) => {
	// List users (super only).
	
	if(!request.isRank(app.ranks.ADMIN)){
		return response.error('action/notAuthorized');
	}
	
	app.database.query('select * from users order by displayName', (err, results) => {
		if(err){
			return response.error('user/error', err);
		}
		
		response.send(results.map(app.outputUser));
		
	});
	
};