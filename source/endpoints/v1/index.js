module.exports = recline => (req, res) => {
	console.log(req.body);
	res.send({
		hello: 'Hello World!'
	});
};