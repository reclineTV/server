module.exports = app => ({
	
	// Database settings:
	database: {
		host: 'localhost',
		user: 'recliner',
		password: '',
		database: 'recline'
	},
	
	// Email sending:
	email: {
		connect: {
			host: '',
			secure: true,
			auth: {
				user: '',
				pass: ''
			},
			tls: {
				rejectUnauthorized: true
			}
		},
		from: 'Recline <springs@recline.tv>'
	},
	
	// SMS send/ receive:
	sms: {
		
		twilio:{
			sid: '',
			token: '',
			from: ''
		}
		
	},
	
	// The server port:
	port: 80,
	
})