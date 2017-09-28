var hashAndSalt = require('password-hash-and-salt');
var randomString = require("randomstring");

module.exports = app => (request, response) => {
	
	var {
		email,
		password
	} = request.body;
	
	// Get the user by email:
	app.database.query('SELECT * FROM users WHERE email=?', [email], (err, results) => {
		var user = results[0];
		
		if(!user.active || user.deleted){
			return response.error('user/notActive');
		}
		
		// Verify the password:
		hashAndSalt(password).verifyAgainst(user.passhash, (error, verified) => {
			if(error || !verified)
				return response.error('user/nonExistent');
			
			// Success!
			
			// Create a login token now:
			var token = randomString.generate(32);
			app.database.query("INSERT INTO tokens (token, user, assigned, expires) VALUES (?, ?, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 YEAR))",
			[token, user.id], (err, results) => {
				
				if(error)
					return response.error('token/failed');
				
				// Set the cookie now:
				response.cookie('user', user.id + '@' + token, { maxAge: 31557600, httpOnly: true });
				
				// Send useful output:
				response.send({
					user: app.outputUser(user),
					token
				});
				
			});
			
		});
		
	});
	
};