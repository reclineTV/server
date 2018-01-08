module.exports = app => (request, response) => {
	// Get media.
	
	let {
		id
	} = request.body;
	
	// Optionally you can provide parentSet. Otherwise this searches through media without a parent.
	app.database.query(
		'select * from media where id=?',
		[id],
		(err, results) => {
			response.send(results[0]);
		}
	);
	
};