var hashAndSalt = require('password-hash-and-salt');

module.exports = app => (request, response) => {
	// Update or create an account.
	// What the endpoint does depends if ID is provided or not.
	// note that 'update' endpoints are aliased as 'add' too.
	
	let {
		id,
		email,
		password,
		passwordRepeat,
		dateOfBirth,
		displayName,
		guest
	} = request.body;
	
	var created;
	
	function ready(){
		
		// Insert/ update now:
		app.database.insertOrUpdate('users', {
			id,
			email,
			dateOfBirth,
			displayName,
			passhash: password,
			rank: guest ? 1 : 2,
			created
		}, (err, id) => {
			if(err){
				// E.g. because invalid ID
				return response.error('user/failed');
			}
			
			// Output the ID:
			response.send({
				id
			});
		});
		
	}
	
	if(id){
		// Run update now:
		ready();
	}else{
		// Creating an account - password required:
		if(!password || password!=passwordRepeat){
			return response.error('passwords/mustMatch');
		}
		
		hashAndSalt(password).hash(function(error, hash) {
			if(error){
				return response.error('passwords/mustMatch');
			}
			password = hash;
			created = new Date();
			ready();
		});
	}
	
};