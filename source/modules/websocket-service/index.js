var uws = require('uws');
var ab2str = require('arraybuffer-to-string');

/*
	A websocket service running on the recline server.
	Note! The websocket service is more for what clients can do to *each other* rather than 
	clients doing things to the recline server itself.
	
	For example, turning a remote TV on. Changing that TV to a particular stream. Play/pause etc.
	Particularly important for e.g. headless/ embedded audio systems.
*/

module.exports = app => {
	
	var clientId = 1;
	var defaultPort = 8290;
	
	// Create a WS server:
	app.websockets = {
		clients: [],
		server: new uws.Server({ port: app.settings.websockets ? (app.settings.websockets.port || defaultPort) : defaultPort }),
		messageTypes: {},
		find: (nameOrId, type) => {
			if(nameOrId && type){
				// Name and type:
				return app.websockets.clients.find(e => e.name == nameOrId && e.type==type);
			}
			// Just ID:
			return app.websockets.clients.find(e => e.id == nameOrId);
		}
	}
	
	/* Gets the JSON-friendly fields of a client. */
	function tidyClient(client){
		return {
			name: client.name,
			id: client.id,
			capabilities: client.capabilities,
			type: client.type,
			since: client.since
		};
	}
	
	var messageTypes = app.websockets.messageTypes;
	
	/*
	* The special hello message. Must be sent before anything else.
	*/
	messageTypes["recline/hello"] = (message, ws) => {
		// Client has started up. Message must contain type and name:
		if(!message.name || !message.clientType){
			console.log('Client name and clientType required. Got this message instead: ', message);
			ws.terminate();
			return;
		}
		
		var name = message.name.trim();
		var type = message.clientType.trim().toLowerCase();
		
		// Get client with same name:
		var client = app.websockets.find(name, type);
		
		if(client){
			// Client with this name/ type still cached - probably a broken disconnect (e.g. cable pulled out).
			// Just reclaim this client object.
			client.hello = message;
			client.socket = ws;
			console.log('Reusing a client');
		}else{
			client = {
				name,
				type,
				capabilities: message.capabilities,
				hello: message,
				since: new Date(),
				id: clientId++,
				socket: ws
			};
			
			console.log('Adding a client', client.id);
			// Add the client:
			app.websockets.clients.push(client);
		}
		
		ws.client = client;
		
		console.log('Send a welcome!');
		
		// Let them know we're happy:
		ws.send({
			type:"recline/welcome",
			id: client.id
		});
		
		// Tell everybody (except client themselves) that 'client' joined:
		app.websockets.server.broadcast({
			type: "client/connected",
			client: tidyClient(client)
		}, ws);
	};
	
	/* Client EP's - getting a list of available clients */
	messageTypes["client/list"] = (message, ws) => {
		
		// Send the response:
		ws.send({
			type: "client/list",
			clients: app.websockets.clients.map(tidyClient)
		});
		
	}
	
	/* Client EP's - forward a message to a particular client */
	messageTypes["client/forward"] = (message, ws) => {
		// Get the client by its ID:
		var target = app.websockets.find(message.id);
		
		if(!target){
			// The client with the ID targeted is not available.
			ws.send({
				type: "client/notfound",
				id: message.id
			});
			return;
		}
		
		if(!message.payload || !message.payload.type){
			ws.send({
				type: "client/forwardfail",
				message: "Forward must have a payload with a message type"
			});
			return;
		}
		
		console.log('Target client found; ', message);
		
		// Send the message on now:
		message.payload.forwarded = {
			from: ws.client ? ws.client.id : undefined
		};
		
		target.socket.send(message.payload);
	}
	
	/* Received a websocket message from the client */
	function onMessage(messageBuffer, ws) {
		var message;
		
		try{
			message = JSON.parse(ab2str(messageBuffer));
		}catch(e){
			console.log("Invalid WS message sent. It must be JSON: ", message, e);
			return;
		}
		
		if(!message.type){
			console.log('Message type required. Ignored: ',message);
			return;
		}
		
		if(!messageTypes[message.type]){
			console.log('Unknown message type. Ignored: ',message);
			return;
		}
		
		// Get the message handler:
		var messageHandler = messageTypes[message.type];
		
		// Must have started (and have ws.client set) if the type is not hello:
		if(!ws.client && message.type!="recline/hello"){
			console.log('A message was received before "recline/hello" was sent. Ignored: ',message);
			return;
		}
		
		// OK - run the handler now:
		messageHandler(message, ws);
	}
	
	// Client connected:
	app.websockets.server.on('connection', ws => {
		
		// Wrap send:
		ws._send = ws.send;
		ws.send = function(jsonData) {
			if(jsonData && jsonData.type) {
				// JSON encode:
				this._send(JSON.stringify(jsonData));
			}else{
				// As-is:
				this._send(jsonData);
			}
		};
		
		ws.on('message', message => onMessage(message, ws));
		
		// Client disconnected
		ws.on('close', e => {
			// Bye!
			if(ws.client){
				// Remove from the client list:
				app.websockets.clients = app.websockets.clients.filter(client => client!=ws.client);
				
				// Client gone
				app.websockets.server.broadcast({
					type: "client/disconnected",
					client: tidyClient(ws.client)
				});
			}
		});
		
	});
	
	// Add a broadcast function:
	app.websockets.server.broadcast = function(data, skip) {
		// Encode just the once:
		var jsonEncoded = JSON.stringify(data);
		app.websockets.server.clients.forEach(function(client) {
			if (client.readyState === uws.OPEN && client != skip) {
				client._send(jsonEncoded);
			}
		});
	};
	
};