module.exports = recline => {
	/* Error handlers */
	const express = recline.express;
	
	express.use((req, res, next) => {
		// Converts a missing endpoint into a 404.
		res.status(404).send({});
	});
	
	if (express.get('env') === 'development') {
		express.use((err, req, res, next) => {
			res.status(err.status || 500)
			   .send({
					message: err.message,
					error: err
				});
		});
	} else {
		express.use((err, req, res, next) => {
			res.status(err.status || 500)
			   .send({
					message: err.message,
					error: {}
				});
		});
	}
	
}