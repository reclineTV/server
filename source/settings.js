module.exports = app => ({
	
	// Database settings:
	database: {
		host: 'localhost',
		user: '',
		password: '',
		database: ''
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
		from: 'Recline <recline@example.com>'
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
	port: 4242,
	
})