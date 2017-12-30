/*
* Email/SMS message templating.
*/

module.exports = app => {
	
	const database = app.database;
	const templates = {};
	
	/*
	 * Builds a single template section (e.g. the subject).
	*/
	function build(templateBody, vars){
		
		var str = '';
		
		// For each segment..
		for(var i=0;i<templateBody.length;i++){
			var chunk = templateBody[i];
			
			if(chunk.reference){
				// Load the value by name now!
				str+=vars[chunk.reference];
			}else{
				// just text:
				str+=chunk;
			}
			
		}

		return str;
	}

	/*
	 * Gets info for a template
	*/
	function get(name, done){
		
		if(templates[name]){
			done(templates[name]);
			return;
		}
		
		// Load the template now:
		database.query(
			'select * from templates where Name=? limit 1',
			[name],
			function(error,results,fields){
				
				if(results && results.length==1){
					
					// Store it:
					var raw = results[0];
					
					var template = {
						raw: raw,
						subject: cacheTemplateValue(raw.Subject),
						html: cacheTemplateValue(raw.Html),
						text: cacheTemplateValue(raw.Text),
						sms: cacheTemplateValue(raw.Sms)
					};
					
					templates[name] = template;
					
					done(template);
					
				}else{
					// Doesn't exist!
					done(null);
				}
				
			}
		);
		
	}
	
	/* 
	* Breaks a template string up into quickly resolved chunks.
	*/
	function cacheTemplateValue(str){
		
		// Quick and dirty:
		var pieces = str.split('|');
		
		// We now alternate between being in a value and not in a value.
		for(var i=1;i<pieces.length;i+=2){
			
			// Convert this string into a value reference.
			pieces[i] = {reference: pieces[i]};
			
		}
		
		return pieces;
		
	}
	
	app.templates = {
		get: get,
		build: build
	};
};
