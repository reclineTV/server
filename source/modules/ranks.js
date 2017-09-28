module.exports = app => {
	
	var admin = {
		name: "Admin",
		id: 3
	};

	var normal = {
		name: "Normal user",
		id: 2
	};

	var guest = {
		name: "Guest",
		id: 1
	};

	var all = [
		guest,
		normal,
		admin
	];
	
	app.ranks = {
		
		ADMIN: admin,
		NORMAL: normal,
		GUEST: guest,
		all
		
	};
	
}