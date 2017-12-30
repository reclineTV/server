/*
	Helper method for checking user rank (is at least the given one)
*/
function isRank(rank){
	return this.user && this.user.rank >= rank.id;
};

module.exports = app => {
	
	/*
	* Loads the auth'd user.
	*/
	app.loadUser = (request, callback) => {
		
		// If it's cached..
		if(request.user !== undefined){
			return;
		}
		
		// Add isRank method:
		request.isRank = isRank;
		
		// Reusable method to use whenever it fails to load
		function error(){
			request.cookies.user = null;
			callback(request.user);
		}
		
		// Got a cookie called 'user'?
		if(!request.cookies || !request.cookies.user){
			return error();
		}
		
		// Get the cookie parts:
		var parts = request.cookies.user.split('@');
		
		if(parts.length != 2){
			return error();
		}
		
		var id = parseInt(parts[0]);
		var token = parts[1];
		
		// Go get the user now:
		app.database.query(
			'select users.*, tokens.expires as tokenExpiry from tokens left join users on tokens.user = users.id where tokens.user=? and tokens.token=?',
			[id, token],
			(err, results) => {
				if(err || !results.length){
					return error();
				}
				var row = results[0];
				if(new Date(row.tokenExpiry) < new Date()){
					// Expired token
					return error();
				}
				request.user = row;
				callback(row);
			}
		);
		
	};
	
	/*
	* Gets the fields suitable for sending out over the API for a user account.
	*/
	app.outputUser = user => {
		return {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			rank: user.rank
		};
	};
	
}