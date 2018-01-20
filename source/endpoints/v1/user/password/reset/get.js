module.exports = app => (request, response) => {
	
	// user/password/reset/get
	// verifies the token
	var {
		token,
		userID
	} = request.body;
	
	app.database.query(
		"SELECT expires FROM forgottokens WHERE token=? and user=?",
		[token, userID],
		(err, results) => {
			if(err || !results.length){
				return response.error('reset/invalid', err);
			}
			
			var row = results[0];
			
			if(new Date(row.expires) < new Date()){
				return response.error('reset/expired');
			}
			
			// Ok!
			response.send({});
			
		}
	);
};