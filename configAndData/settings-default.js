/*
	Default settings. Saving config via recline will overwrite this file.
	If you include the recline-server package, you can give it optional overrides.
*/
module.exports = {
	// Database settings:
	database: {
		host: 'localhost',
		user: 'recliner',
		password: 'password',
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
	
	// Content providers:
	providers: [
		{
			// This translates file://A/1.mp3 translates to ./configAndData/media/1/original.mp3
			type: 'file',
			name: 'A',
			path: 'E:\\Media\\Recline'
		},
		{
			type: 'enigma2',
			host: '192.168.1.113'
		},
		{
			type: 'youtube'
		},
		{
			type: 'rdp',
			domain: '',
			port: 5000,
			username: '',
			password: ''
		}
	],
	
	// Dolphin emulator:
	dolphin: {
		path: 'E:\\Media\\Emulators\\Dolphin\\Dolphin.exe'
	},
	
	// PCSX2 emulator:
	pcsx2: {
		path: 'E:\\Media\\Emulators\\PCSX2\\pcsx2.exe'
	},
	
	// ePSXe emulator:
	epsxe: {
		path: 'E:\\Media\\Emulators\\ePSXe\\ePSXe.exe'
	},
	
	// Themoviedb:
	themoviedb: {
		key: 'd68e56f794a5557341f8d6ad00a4ae56'
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
	port: 8087,
	
};