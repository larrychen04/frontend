
if(! window.fb){
	window.fb = {};
}

fb.media = {player:{}};

fb.media.getSwf = function(id){
	var isIE = navigator.appName.indexOf("Microsoft") != -1;   
	return (isIE) ? window[id] : document[id];  
	

}
fb.media.player._data = {_listeners:{},_players:{}};



fb.media.player.Event = function(type,data){
	this.type = type;
	this.data = data;
};
fb.media.player.PLAYER_COUNT = 0;
fb.media.player.generatePlayerId = function(){
	return "player-" + fb.media.player.PLAYER_COUNT++;
}


fb.media.player.Event.APPLICATION_READY = "APPLICATION_READY";
fb.media.player.Event.PLAYER_READY = "PLAYER_READY";
fb.media.player.Event.PLAYER_UPDATE = "PLAYER_UPDATE";
fb.media.player.Event.PLAYER_COMPLETE = "PLAYER_COMPLETE";
fb.media.player.Event.PLAYER_STATECHANGE = "PLAYER_STATECHANGE";
fb.media.player.Event.PLAYER_DOWNLOAD = "PLAYER_DOWNLOAD";




fb.media.player.addEventListener = function(playerId,type,callback){
	fb.media.player.registerListener(playerId);
	if(! fb.media.player._data._listeners[playerId][type]){
		fb.media.player._data._listeners[playerId][type] = [];
	}
	
	fb.media.player._data._listeners[playerId][type].push(callback);
	
};

fb.media.player.removeEventListener = function(playerId,type,callback){
	fb.media.player.registerListener(playerId);
	
	try{
		var listeners = fb.media.player._data._listeners[playerId][type];
		for(var i=listeners.length-1;i >=0;i--){
			if(listeners[i] == callback){
				listeners.splice(i,1);
			}
		}
	}
	catch(exc){}
};
fb.media.player.removeEventListeners = function(playerId,type){
	fb.media.player._data._listeners[playerId][type] = [];
};

fb.media.player.registerListener = function(playerId){
	//fb.media.player._data._players = fb.media.getSwf(playerId);
	if(! fb.media.player._data._listeners[playerId]){
		fb.media.player._data._listeners[playerId] = {};
	}
};

fb.media.player.registerPlayer = function(player){
	fb.media.player._data._players[player.playerId] = player;
}
fb.media.player.getPlayer = function(playerId){
	return fb.media.player._data._players[playerId];
}
fb.media.player.getPlayers = function(){
	return fb.media.player._data._players;
}
fb.media.player.dispatchEvent = function(playerId,event){
	fb.media.player.registerListener(playerId);
	var listeners = fb.media.player._data._listeners[playerId][event.type];
	if(listeners){
		for(var i=0;i < listeners.length;i++){
			if(event.cancelled){
				break;
			}
			listeners[i].apply(null,[event]);
			
		}
	}
	
};

fb.media.player.formatDuration = function(duration){
	duration = Math.round(duration);
	var seconds = duration % 60;
	var minutes = Math.floor(duration / 60);
	
	if(seconds < 10)
		seconds = '0' + seconds;
	if(minutes < 10)
		minutes = '0' + minutes;
	
	return minutes + ":" + seconds;
};


fb.media.player.Video = function($video,settings){
	this.$video = $video;
	this.settings = settings;
	this.video = $video.get(0);
	this.source =  $video.attr('src') || $('source', $video).attr('src') || $video.attr('data-src');
	this.youtubeId = $video.attr('data-youtube');
	this.type = $video.attr('data-youtube') ? "youtube" : "video";
	this.width = $video.attr('width');
	this.height = $video.attr('height');
	this.cssClass = $video.attr('class');
	this.useFlash = false;
	this.useHtml = false;
	this.swf = null;
	this.playerId = null;
	this.playerState = {volume:1,totalTime:0,currentTime:0,state:null,prevState:null};
	this.isMobile = settings.isMobile;
	this.init();
	return this;
}
fb.media.player.Video.prototype.init = function(){
	if(this.type == 'youtube' && swfobject.hasFlashPlayerVersion("9.0")){
		this.source = this.youtubeId;
		this.useFlash = true;
		this.useHtml = false;
	}
	else if(this.canPlayVideo(this.source)){
		this.useFlash = false;
		this.useHtml = true;
	}
	else if(swfobject.hasFlashPlayerVersion("9.0")){
		this.useFlash = true;
		this.useHtml = false;
	}
	else{
		this.useFlash = false;
		this.useHtml = false;
	}

	if(! this.useFlash && ! this.useHtml){
		return;
	}
	var _this = this;
	var id = this.playerId = this.$video.attr('id') || fb.media.player.generatePlayerId();
	if(this.useFlash){
		
		if(this.$video.attr('data-rtmp')){
			this.source = this.$video.attr('data-rtmp');
		}
		
		var html = '<div id="' + id + '-wrapper" class="' + this.cssClass + '"><div id="' + id + '"></div></div>';
		
		this.$video.replaceWith(html);
		this.$video = $("#" + id + '-wrapper');
		fb.media.player.addEventListener(id,fb.media.player.Event.APPLICATION_READY,function(e){
			_this.swf = fb.media.getSwf(id);
			_this.setState(e.data);
		});
		
		swfobject.embedSWF(this.settings.swfPath, id, "100%", "100%", "9.0.0", "/cms/swf/expressInstall.swf", {type:this.type, source: this.source, playerId: this.playerId,autoPlay:this.settings.autoPlay,autoLoad:this.settings.autoLoad,autoRewind:this.settings.autoRewind,cornerRadius:this.settings.cornerRadius || 0 }, { wmode: 'transparent', allowscriptaccess: 'always',allowfullscreen:'true'}, { styleclass: this.settings.swfClass });
		
		
		
	}
	else{
		this.$video.bind('timeupdate',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_UPDATE);
			
		});
		this.$video.bind('seeked',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_UPDATE);
			
		});
		this.$video.bind('ended',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_COMPLETE);
			
		});
		this.$video.bind('loadedmetadata',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_READY);
		});
		this.$video.bind('progress',function(e){
			//_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_DOWNLOAD);
		});
		this.$video.bind('playing',function(e){
			_this.playerState.state = 'playing';
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
		});
		this.$video.bind('pause',function(e){
			_this.playerState.state = 'paused';
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
		});
		if(this.$video.attr('data-src')){
			this.$video.attr('src',this.$video.attr('data-src')).removeAttr('data-src');
		}
		
		if(this.isMobile){
			/*setTimeout(function(){
				_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_READY);
			},1000);*/
		}
		else if(this.settings.autoPlay){
			this.playerState.state = 'buffering';
			this.video.play();
		}
		else if(this.settings.autoLoad){
			this.playerState.state = 'loading';
			this.video.load();
		}
		
		fb.media.player.dispatchEvent(this.playerId,fb.media.player.Event.APPLICATION_READY);
		
		
	}
	
	var genericHandler = function(e){
		if(e.data){
			_this.setState(e.data);
		}
	};
	
	fb.media.player.registerPlayer(this);
	
	//fb.media.player.addEventListener(this.playerId,fb.media.player.Event.APPLICATION_READY,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_READY,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_UPDATE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_COMPLETE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_STATECHANGE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_DOWNLOAD,genericHandler);
	
};

fb.media.player.Video.prototype.dispatchPlayerEvent = function(type){
	var eData = {
			currentTime:isNaN(this.video.currentTime) ? 0 :this.video.currentTime,
			totalTime:isNaN(this.video.duration) ? 0 :this.video.duration,
			volume:isNaN(this.video.volume) ? 1 :this.video.volume,
			type:type
	};
	var event = {type:type,data:eData};
	fb.media.player.dispatchEvent(this.playerId,event);
	
	
} 

fb.media.player.Video.prototype.setState = function(data){
	if(data.state != this.playerState.state){
		this.playerState.prevState = data.state;
	}
	$.extend(this.playerState,data);
};

fb.media.player.Video.prototype.canPlayVideo = function(url){
	var v = this.video ? this.video : document.createElement('video');
	var extension = url.split('.').pop();
	switch(extension){
		case 'ogg':
			 return !!(v.canPlayType && v.canPlayType('video/ogg; codecs="theora, vorbis"').replace(/no/, ''));
		break;
		case 'webm':
			 return !!(v.canPlayType && v.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
		break;
		case 'mp4':
		default:
			return !!(v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
		break;
	}
	
};

fb.media.player.Video.prototype.play = function(){
	if(this.useFlash){
		if(! this.swf){
			return;
		}
		this.swf.playMedia();
	}
	else{
		//this.playerState.state = 'playing';
		this.video.play();
		//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
	}
};

fb.media.player.Video.prototype.isPlaying = function(){
	return this.playerState.state == 'playing' || (this.playerState.prevState == 'playing' && this.playerState.state == 'buffering');
};

fb.media.player.Video.prototype.pause = function(){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.pauseMedia();
		
	}
	else{
		if(this.playerState.state != 'paused'){
			this.playerState.state = 'paused';
			//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
			this.video.pause();
		}
		
		
	}
};
fb.media.player.Video.prototype.stop = function(){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		if(this.swf.stopMedia){
			this.swf.stopMedia();
		}
	}
	else{
		this.playerState.state = 'stopped';
		this.video.pause();
		//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
	}
};

fb.media.player.Video.prototype.seek = function(seekTo){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.seekTo(seekTo);
	}
	else{
		
		this.video.currentTime = seekTo;
		
	}
};

fb.media.player.Video.prototype.setVolume = function(volume){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.setVolume(volume);
	}
	else{
		this.video.volume = volume;
	}
};

fb.media.player.Video.prototype.setFullscreen = function(fullscreen){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		if(fullscreen){
			this.swf.enterFullScreen();
		}
		else{
			this.swf.exitFullScreen();
		}
		
	}
};

fb.media.player.Video.prototype.cueVideo = function(){
	if(this.type == 'youtube' && this.swf){
		this.swf.cueVideo();
	}
	
}


$.fn.fbVideo = function(options){
	var settings = $.extend({},$.fn.fbVideo.defaults,options);
	var $context = this;
	this.player = new fb.media.player.Video($context,settings)
	return this;
	
}
$.fn.fbVideo.defaults = {swfPath:'/nvoi/swf/BuroPlayer.swf?v=20110701.5',autoPlay:false,autoLoad:true,autoRewind:false,swfClass:'swf'};



/***
 * 
 * audio
 * 
 */

fb.media.player.Audio = function($audio,settings){
	this.$audio = $audio;
	this.settings = settings;
	this.audio = $audio.get(0);
	this.source =  $audio.attr('src') || $('source', audio).attr('src');
	this.width = $audio.attr('width');
	this.height = $audio.attr('height');
	this.cssClass = $audio.attr('class');
	this.useFlash = false;
	this.swf = null;
	this.playerId = null;
	this.playerState = {volume:1,totalTime:0,currentTime:0,state:null,prevState:null};
	this.isMobile = settings.isMobile;
	
	this.init();
	return this;
}
fb.media.player.Audio.prototype.init = function(){
	
	if(this.canPlayAudio(this.source)){
		this.useFlash = false;
	}
	else{
		this.useFlash = true;
	}
	var _this = this;
	var id = this.playerId = this.$audio.attr('id') || fb.media.player.generatePlayerId();
	if(this.useFlash){
		
		if(this.$audio.attr('data-rtmp')){
			this.source = this.$audio.attr('data-rtmp');
		}
		
		var html = '<div id="' + id + '-wrapper" class="' + this.cssClass + '"><div id="' + id + '"></div></div>';
		
		this.$audio.replaceWith(html);
		this.$audio = $("#" + id + '-wrapper');
		fb.media.player.addEventListener(id,fb.media.player.Event.APPLICATION_READY,function(e){
			_this.swf = fb.media.getSwf(id);
			_this.setState(e.data);
		});
		
		swfobject.embedSWF(this.settings.swfPath, id, "100%", "100%", "9.0.0", "/cms/swf/expressInstall.swf", {type:'audio', source: this.source, playerId: this.playerId,autoPlay:this.settings.autoPlay,autoLoad:this.settings.autoLoad,autoRewind:this.settings.autoRewind,loopCount:this.settings.loopCount }, { wmode: 'transparent', allowscriptaccess: 'always',allowfullscreen:'true'}, { styleclass: this.settings.swfClass });
		
		
		
	}
	else{
		this.$audio.bind('timeupdate',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_UPDATE);
			
		});
		this.$audio.bind('seeked',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_UPDATE);
			
		});
		this.$audio.bind('ended',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_COMPLETE);
			
		});
		this.$audio.bind('loadedmetadata',function(e){
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_READY);
		});
		this.$audio.bind('progress',function(e){
			//_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_DOWNLOAD);
		});
		this.$audio.bind('playing',function(e){
			_this.playerState.state = 'playing';
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
		});
		this.$audio.bind('pause',function(e){
			_this.playerState.state = 'paused';
			_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
		});
		
		
		if(this.isMobile){
			setTimeout(function(){
				_this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_READY);
			},1000);
		}
		else if(this.settings.autoPlay){
			this.playerState.state = 'buffering';
			this.audio.play();
		}
		else if(this.settings.autoLoad){
			this.playerState.state = 'buffering';
			this.audio.load();
		}
		
		
		
		
	}
	
	var genericHandler = function(e){
		if(e.data){
			_this.setState(e.data);
		}
	};
	//fb.media.player.addEventListener(this.playerId,fb.media.player.Event.APPLICATION_READY,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_READY,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_UPDATE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_COMPLETE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_STATECHANGE,genericHandler);
	fb.media.player.addEventListener(this.playerId,fb.media.player.Event.PLAYER_DOWNLOAD,genericHandler);
	fb.media.player.registerPlayer(this);
};

fb.media.player.Audio.prototype.dispatchPlayerEvent = function(type){
	var eData = {
			currentTime:isNaN(this.audio.currentTime) ? 0 :this.audio.currentTime,
			totalTime:isNaN(this.audio.duration) ? 0 :this.audio.duration,
			volume:isNaN(this.audio.volume) ? 1 :this.audio.volume,
			type:type
	};
	var event = {type:type,data:eData};
	fb.media.player.dispatchEvent(this.playerId,event);
	
	
} 

fb.media.player.Audio.prototype.setState = function(data){
	if(data.state != this.playerState.state){
		this.playerState.prevState = data.state;
	}
	$.extend(this.playerState,data);
};

fb.media.player.Audio.prototype.canPlayAudio = function(url){
	var v = this.audio ? this.audio : document.createElement('audio');
	var extension = url.split('.').pop();
	switch(extension){
		case 'ogg':
			 return !!(v.canPlayType && v.canPlayType('audio/ogg').replace(/no/, ''));
		break;
		case 'mp3':
		default:
			return !!(v.canPlayType && v.canPlayType('audio/mpeg').replace(/no/, ''));
		break;
	}
	
};

fb.media.player.Audio.prototype.play = function(){
	if(this.useFlash){
		if(! this.swf){
			return;
		}
		this.swf.playMedia();
	}
	else{
		//this.playerState.state = 'playing';
		this.audio.play();
		//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
	}
};

fb.media.player.Audio.prototype.isPlaying = function(){
	return this.playerState.state == 'playing' || (this.playerState.prevState == 'playing' && this.playerState.state == 'buffering');
};

fb.media.player.Audio.prototype.pause = function(){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.pauseMedia();
		
	}
	else{
		if(this.playerState.state != 'paused'){
			this.playerState.state = 'paused';
			//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
			this.audio.pause();
		}
		
		
	}
};
fb.media.player.Audio.prototype.stop = function(){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.stopMedia();
	}
	else{
		this.playerState.state = 'stopped';
		this.audio.pause();
		//this.dispatchPlayerEvent(fb.media.player.Event.PLAYER_STATECHANGE);
	}
};

fb.media.player.Audio.prototype.seek = function(seekTo){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.seekTo(seekTo);
	}
	else{
		
		this.audio.currentTime = seekTo;
		
	}
};

fb.media.player.Audio.prototype.setVolume = function(volume){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		this.swf.setVolume(volume);
	}
	else{
		this.audio.volume = volume;
	}
};

fb.media.player.Audio.prototype.setFullscreen = function(fullscreen){
	if(this.useFlash){
		if(! this.swf || ! this.playerState.state){
			return;
		}
		if(fullscreen){
			this.swf.enterFullScreen();
		}
		else{
			this.swf.exitFullScreen();
		}
		
	}
};




$.fn.fbAudio = function(options){
	var settings = $.extend({},$.fn.fbAudio.defaults,options);
	var $context = this;
	this.player = new fb.media.player.Audio($context,settings)
	return this;
	
}
$.fn.fbAudio.defaults = {swfPath:'/cms/swf/BuroPlayer.swf?v=20110701.5',autoPlay:true,autoLoad:true,autoRewind:false,swfClass:'swf',loopCount:1};


