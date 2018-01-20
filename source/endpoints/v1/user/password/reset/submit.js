var hashAndSalt = require('password-hash-and-salt');

module.exports = app => (request, response) => {
		
	// user/password/submit 
	// Allows a user to submit their new password with the password
	// reset token. This will change their password. 
	
	const {
		token,
		userID,
		password,
		passwordRepeat
	} = request.body;
	
	if(!password || password != passwordRepeat)
	{
		return response.error('passwords/mustMatch');
	}
	
	app.database.query("SELECT expires FROM forgottokens WHERE token=? and user=?",[token, userID], (err, results) => {
		
		if(err || !results.length){
			return response.error('reset/invalid', err);
		}
		
		var row = results[0];
	
		if(new Date(row.expires) < new Date()){
			return response.error('reset/expired');
		}
		
		// Generate a new hash now:
		hashAndSalt(password, (err, hash) => {
			
			if(err){
				return response.error('token/invalid', err);
			}
			
			app.database.query('UPDATE users SET passhash=? where id=?', [hash, userID], (err, results) => {
				
				if(err){
					return response.error('token/invalid', err);
				}
				
				// Ok!
				response.send({});
				
			});
			
		});
		
	});
};
