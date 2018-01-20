var mysql = require('mysql');

function connect(options) {

	// Create a connection object:
	var connection = mysql.createPool(options);
	
	// Ok!
	return connection;

}

/**
* If the given thing is an array this returns the array joined by ,
* Otherwise it returns *.
*/
function fields(fieldSet) {
	
	if (fieldSet) {
		return fieldSet.join(',');
	}
	
	return '*';
}

/**
 * Converts an object such as {Field:Value, Field:Value} into a query string and its associated parameters.
 * Optionally appends to an existing args set.
 * @param fields
 */
function fieldString(fields, existingArgs){

	// Build an SQL string of the form Field1=?,Field2=?,Field3=? etc.
	// Also build the args set at the same time for correct order.
	var fieldString = '';
	var args = existingArgs ? existingArgs : [];
	var first = true;

	for (var field in fields) {

		if (first) {
			first = false;
		} else {
			fieldString +=",";
		}

		fieldString += field + "=? ";

		// Add to args set:
		args.push(fields[field]);

	}
	
	return {
		fields: fieldString,
		args: args
	};
}

/**
 * Creates an insert set from the given object.
 * @param fields
 */
function insertString(fields,existingArgs) {

	// Build an SQL string of the form Field1,Field2,Field3 (fields), ?,?,? (parameters) and [value1,value2,value3] (args).
	// Also build the args set at the same time for correct order.
	var fieldString = '';
	var paramString = '';
	var args = existingArgs ? existingArgs : [];
	var first = true;

	for (var field in fields) {

		if (first) {
			first = false;
		} else {
			fieldString += ",";
			paramString += ",";
		}

		fieldString += field;
		paramString += "?";

		// Add to args set:
		args.push(fields[field]);

	}

	return {
		fields: fieldString,
		args: args,
		parameters: paramString
	};
}

module.exports = app => {
	// Exports:
	
	var config = app.settings.database;
	
	var dbSettings = Object.assign({multipleStatements: true}, config);
	
	if(!dbSettings.connectionLimit){
		dbSettings.connectionLimit = 10;
	}
	
	var exports = connect(dbSettings);
	
	// Setup query func:
	exports.query = function(query, args, cb){
		if(!cb){
			cb = args;
			args = [];
		}
		
		// Get link from pool:
		exports.getConnection(function(err, connection){
			
			if(err){
				cb(err);
				return;
			}
			
			// Run the query:
			connection.query(query, args, function(...argset){
				
				// Release the link:
				connection.release();
				
				// Run the callback:
				cb(...argset);
				
			});
			
		});
	};
	
	// Add our extra methods:
	exports.insertString = insertString;
	exports.fieldString = fieldString;
	exports.fields = fields;
	exports.insertOrUpdate = function(table, fields, done) {
		
		if(fields.id){
			var id = parseInt(fields.id);
			
			// Build the set of update fields:
			var fieldStr = fieldString(fields);
			
			// Append id:
			fieldStr.args.push(id);
			
			// Run the update query now:
			exports.query(
				'UPDATE ' + table + ' SET ' + fieldStr.fields + ' WHERE id = ?',
				fieldStr.args,
				function(err, results) {
					done(err, id);
				}
			);
			
		}else{
			// Build the set of insert fields:
			var insertStr = insertString(fields);
			
			// Run the query now:
			exports.query(
				'INSERT INTO ' + table + ' (' + insertStr.fields + ') VALUES (' + insertStr.parameters + ')',
				insertStr.args,
				function(err, results) {
					done(err, !err ? results.insertId : undefined);
				}
			);
		}
		
	};
	app.database = exports;
};