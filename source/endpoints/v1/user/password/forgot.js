var randomString = require("randomstring");

module.exports = app => (request, response) => {
	
	// user/password/forgot
	// Allows a user to request a password reset to the email they provide.

	const {
		email
	} = request.body;

	var token = randomString.generate(32);

	if(!email){
		error('user/invalid');
	}

	// Does a user exist with this email?
	app.database.query("SELECT id, email FROM users WHERE email=?", [email], (err, results) => {
		
		if(!results.length){
			return response.error('user/invalid');
		}
		
		var user = results[0];
		
		app.database.query(
			"INSERT INTO forgottokens (token, user, created, expires) VALUES (?, ?, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY))",
			[token, user.id],
			(err, results) => {
				if(err){
					return response.error('token/invalid', err);
				}
				
				// Send the email next:
				app.email.send({
					template: 'forgot',
					emails: [
						{
							to: user.email
						}
					]
				}, res => {
					
					// Send an OK:
					response.send({
					});
					
				}).catch(e => response.error('token/error', e))
				
			}
		);
		
	});
};
