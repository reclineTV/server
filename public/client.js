var recline = {};

var config = {
	socket: {
		port: 8290
	},
	name: navigator.userAgent
};

recline.socket = {
	requests: [],
	_requestId: 1,
	clientId: 0,
	playingMedia: {},
	send: function(message){
		var _this = recline.socket;
		return new Promise((success, reject) => {
			var id = _this._requestId++;
			_this.requests.push({
				success,
				reject,
				id
			});
			message.requestId = id;
			_this.current.send(JSON.stringify(message));
		});
	},
	playMedia: function(mediaRef, options){ // Either {id: x} or just 'x' or {provider: '..', ref: '..'}. Options contains the onvideo and onaudio receive methods.
		if(!mediaRef.provider && !mediaRef.id){
			mediaRef = {id: mediaRef};
		}
		
		return recline.socket.send({type: "media/play", ...mediaRef}).then(playingMessage => {
			// The media is now playing! Add a handler for media packets:
			console.log(playingMessage);
			
			// Run meta func:
			options.onmeta && options.onmeta(playingMessage.meta);
			
			recline.socket.playingMedia["" + playingMessage.meta.reference] = {
				meta: playingMessage.meta,
				options,
				channels: playingMessage.meta.channels
			};
		});
	},
	start: function(socketConfig){
		return new Promise((success, reject) => {
			
			var _this = recline.socket;
			var socket = new WebSocket("ws://" + location.hostname + ":"+socketConfig.port+"/");
			socket.binaryType = 'arraybuffer';
			_this.current = socket;
			
			socket.onopen = function() {
				_this.ready = true;
				_this.send({
					type: 'recline/hello',
					name: config.name,
					clientType: 'client-ui',
					capabilities: []
				}).then(welcome => {
					console.log('Welcomed by Recline');
					_this.clientId = welcome.id;
					success();
				})
			};
			
			socket.onclose = function() {
				_this.ready = false;
				// 2s delay then try again:
				setTimeout(() => recline.socket.start(config.socket), 2000);
			};
			
			socket.onmessage = function(msg) {
				// If the first char is '77' then we've got a media packet:
				if(!msg.data || (!msg.data.length && !msg.data.byteLength)){
					console.log('Empty socket message', msg);
					return;
				}
				if(typeof msg.data == "string"){
					// Run msg function:
					_this.onmessage(JSON.parse(msg.data));
				}else{
					var data = new Uint8Array(msg.data);
					
					var is_end_of_frame = data[0] == 78;
					
					// media packet! Establish which channel it's for:
					var streamRef = (data[2] << 8) || data[1];
					var channelId = data[3];
					
					// The media metadata:
					var media = _this.playingMedia["" + streamRef];
					
					if(!media){
						// console.log('Dropping media packet as it\'s not playing', msg);
						return;
					}
					
					var channel = media.channels[channelId];
					
					if(!channel){
						console.log('Channel not found', channelId, media, msg);
						return;
					}
					
					var channelData = msg.data.slice(4);
					
					if(channel.width){
						// This is a video channel.
						media.options.onvideo({
							channel,
							data: channelData,
							is_end_of_frame
						});
					}else{
						// This is an audio channel.
						media.options.onaudio({
							channel,
							data: channelData,
							is_end_of_frame
						});
					}
				}
			};
		});
	},
	onmessage: function(message){
		
		if(message.requestId){
			var request = recline.socket.requests.find(req => req.id == message.requestId);
			
			if(!request){
				console.log('Dropped a message as its request was not found.', message);
				return;
			}
			
			// Remove it:
			recline.socket.requests = recline.socket.requests.filter(req => req.id != message.requestId);
			
			if(request.success){
				// Resolves the promise:
				request.success(message);
			}else if(request.reject){
				request.reject(message);
			}
			
			return;
		}
		
	}
};

recline.start = function(_config){
	if(_config){
		config = {..._config, ...config};
	}
	
	return recline.socket.start(config.socket);
};