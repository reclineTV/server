module.exports = app => (request, response) => {
	// Streams media.
	
	app.database.query(
		'select * from media where deleted=0',
		[],
		(err, results) => {
			response.write('<div>');
			results.forEach(result => response.write('<div style="padding:20px"><a href="/v1/media/stream?id=' + result.id + '">' + result.title + '</a></div>'))
			response.write('</div>');
			response.send();
		}
	);
	
};