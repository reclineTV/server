const nodemailer = require('nodemailer');

module.exports = app => {
	
	// Get the template engine:
	const templates = app.templates;
	
	// Get the settings:
	const settings = app.settings.email;
	
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport(settings.connect);
	
	/*
	 * Sends the given email and runs the callback when it's done (with error and info).
	 * Email contains to, subject, text and html.
	 * Alternatively provide template and emails, where each email must contain at least 'to' and define all vars used by the template.
	*/
	function send(email, done){
		
		if(email.template){
			
			sendTemplated(email,done);
			return;
		}
		
		if(!email.from){
			email.from = settings.from;
		}
		
		if(Array.isArray(email.to)){
			email.to = email.to.join(', ');
		}
		
		// send mail with defined transport object
		transporter.sendMail(email, done);
		
	}

	/*
	 * @private (use send instead)
	 * Sends emails using a template.
	*/
	function sendTemplated(data, done){
		
		// Get the template:
		templates.get(data.template, function(template){
			
			for(var i=0;i<data.emails.length;i++){
				
				// Build the template:
				var email = build(template, data.emails[i]);
				
				// Send it:
				transporter.sendMail(email, function (a, b, c) {
					
					done(a, b, c);

				});
				
			}
			
		});
		
	}

	/*
	* Builds an email from a given template and variable data.
	*/
	function build(template, vars){
		
		var mail = {
			to: vars.to ? vars.to : vars.email,
			from: settings.from,
			subject: templates.build(template.subject, vars),
			html: templates.build(template.html, vars),
			text: templates.build(template.text, vars),
		};
		
		if(vars.attachments){
			mail.attachments = vars.attachments;
		}
		
		return mail;
	}
	
	app.email = {
		send
	};
	
};