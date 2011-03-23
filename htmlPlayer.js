(function($) {
	
	var VideoPlayer = function(elements, options) {
		this.videos = elements;
		this.options = options;
		this.idCounter = 0;
		this.init();
	}
	
	VideoPlayer.prototype = {
		init: function() {
			var _this = this;
			
			this.videos.each(function() {
				var video = $(this);
				_this.wrapVideo(video);
				_this.createControls(video);
				_this.bindControls(video);
			});
		},
		
		bindControls: function(video) {
			var _this = this;
			
			for (var i = 0; i < this.options.controls.length; i++) {
				switch (this.options.controls[i]) {
					case 'play':
						video.parent().find('.' + this.options.prefix + 'play').bind('click', function() {	_this.playPause(video); });
						break;
					case 'progress':
						this.setupProgressBar(video);
						break;
					case 'volume':
						video.parent().find('.' + this.options.prefix + 'volume').bind('click', function() {	_this.setVolume(video); });
						break;
					case 'fullscreen':
						video.parent().find('.' + this.options.prefix + 'fullscreen').bind('click', function() {	_this.toFullscreen(video); });
						break;
					default:
						break;
				}
			}
		},
		
		createButton: function(label, className) {
			var btn = $('<div>').addClass(this.options.prefix + className);
			var label = $('<span>').html(label);
			btn.append(label);
			
			return btn;
		},
		
		createControls: function(video) {
			var wrapper = video.parent();
			var controls = $('<div>').addClass(this.options.prefix + this.options.controlsClass);
			
			for (var i = 0; i < this.options.controls.length; i++) {
				switch (this.options.controls[i]) {
					case 'play':
						var playBtn = this.createButton('Play/Pause', 'play');
						controls.append(playBtn);
						break;
					case 'progress':
						var progressBar = this.createProgressBar();
						controls.append(progressBar);
						break;
					case 'time':
						var timeDisplay = this.createTimeDisplay();
						controls.append(timeDisplay);
						break;
					case 'volume':
						var volumeBar = this.createVolumeBar();
						controls.append(volumeBar);
						break;
					case 'fullscreen':
						var fullScreenBtn = this.createButton('Fullscreen', 'fullscreen');
						controls.append(fullScreenBtn);
						break;
					default:
						console.log('default');
						break;
				}
			}
			
			wrapper.append(controls);
		},
		
		createProgressBar: function() {
			var progressBar = $('<div>').addClass(this.options.prefix + 'progress-bar');
			var progressWrapper = $('<div>').addClass(this.options.prefix + 'progress-wrapper');
			var progressPlay = $('<div>').addClass(this.options.prefix + 'progress-play');
			var progressBuffer = $('<div>').addClass(this.options.prefix + 'progress-buffer');
			
			progressWrapper.append(progressPlay);
			progressWrapper.append(progressBuffer);
			progressBar.append(progressWrapper);
			
			return progressBar;
		},
		
		createTimeDisplay: function() {
			var time = $('<div>').addClass(this.options.prefix + 'time-display');
			var minutes = $('<div>').addClass(this.options.prefix + 'time-minutes');
			var seconds = $('<div>').addClass(this.options.prefix + 'time-seconds');
			
			time.append(minutes);
			time.append(seconds);
			
			return time;
		},
		
		createVolumeBar: function() {
			var volume = $('<div>').addClass(this.options.prefix + 'volume');
			var volumeBtn = $('<div>').addClass(this.options.prefix + 'volume-button').html('Volume');
			var volumeBar = $('<div>').addClass(this.options.prefix + 'volume-bar');
			var volumeIconPlus = $('<div>').addClass(this.options.prefix + 'volume-icon-plus').html('+');
			var volumePosition = $('<div>').addClass(this.options.prefix + 'voulme-position');
			var volumeIconLess = $('<div>').addClass(this.options.prefix + 'volume-icon-less').html('-');
			
			volumeBar.append(volumeIconPlus);
			volumeBar.append(volumePosition);
			volumeBar.append(volumeIconLess);
			
			volume.append(volumeBtn);
			volume.append(volumeBar);
			
			return volume;
		},
		
		getControlsSize: function(video) {
			var size = 0;
			var _this = this;
			
			video.parent().find('.' + this.options.prefix + 'video-controls').children().each(function() {
				var element = $(this);
				if (!element.hasClass(_this.options.prefix + 'progress-bar')) {
					size += element.outerWidth();
				}
			});
			
			return size;
		},
		
		incrementId: function() {
			var id = this.options.videoId + this.idCounter;
			this.idCounter++;
			
			return id;
		},
		
		playPause: function(video) {
			var videoObj = video.get(0);
			
			if (videoObj.paused) {
				videoObj.play();
			} else {
				videoObj.pause();
			}			
		},
		
		setupProgressBar: function(video) {
			var progressBar = video.parent().find('.' + this.options.prefix + 'progress-bar');
			var controlsSize = progressBar.parent().width() - this.getControlsSize(video);
			
			progressBar.width(controlsSize);
		},
		
		wrapVideo: function(video) {
			var _this = this;
			video.wrap('<div>');
			video.parent().addClass(_this.options.prefix + _this.options.wrapperClass).attr('id', _this.incrementId())
			

			video.parent().css({
				width: video.width(),
				height: video.height()
			});
		}
	}
	
	$.fn.htmlPlayer = function(options) {
		var defaults = {
			controls: ['play', 'progress', 'time', 'volume', 'fullscreen'],
			controlsClass: 'video-controls',
			prefix: 'html-player-',
			videoId: 'video-',
			wrapperClass: 'wrapper'
		}
		var options = $.extend(defaults, options);
		return new VideoPlayer(this, options);
	}
})(jQuery);
