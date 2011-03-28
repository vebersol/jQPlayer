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
				_this.bindEvents(video);
			});
		},
		
		bindControls: function(video) {
			var _this = this;
			
			for (var i = 0; i < this.options.controls.length; i++) {
				switch (this.options.controls[i]) {
					case 'play':
						video.parent().find(_this.getClass('play')).bind('click', function() {	_this.playPause(video); });
						break;
					case 'progress':
						this.setupProgressBar(video);
						break;
					case 'volume':
						video.parent().find(_this.getClass('volume-button')).bind('click', function() {	_this.muteVideo(video); });
						break;
					case 'fullscreen':
						video.parent().find(_this.getClass('fullscreen')).bind('click', function() {	_this.toFullscreen(video); });
						break;
					default:
						break;
				}
			}
		},
		
		bindEvents: function(video) {
			var _this = this;
			var video = video.get(0);
			
			video.addEventListener('loadeddata', function() {
			
				if ($.inArray('progress', _this.options.controls)) {				
						_this.setProgressEvents(this);				
				}
			
				if ($.inArray('time', _this.options.controls)) {		
					_this.setupTime(video);
				}
				
				if ($.inArray('volume', _this.options.controls)) {		
					_this.volumeSetup(video);
				}
			
			}, true);
			
			
		},
		
		createButton: function(label, className) {
			var btn = $('<div>').addClass(this.setClass(className));
			var label = $('<span>').html(label);
			btn.append(label);
			
			return btn;
		},
		
		createControls: function(video) {
			var wrapper = video.parent();
			var controls = $('<div>').addClass(this.setClass(this.options.controlsClass));
			
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
						break;
				}
			}
			
			wrapper.append(controls);
		},
		
		createProgressBar: function() {
			var progressBar = $('<div>').addClass(this.setClass('progress-bar'));
			var progressWrapper = $('<div>').addClass(this.setClass('progress-wrapper'));
			var progressPlay = $('<div>').addClass(this.setClass('progress-play'));
			var progressBuffer = $('<div>').addClass(this.setClass('progress-buffer'));
			
			progressWrapper.append(progressPlay);
			progressWrapper.append(progressBuffer);
			progressBar.append(progressWrapper);
			
			return progressBar;
		},
		
		createTimeDisplay: function() {
			var time = $('<div>').addClass(this.setClass('time-display'));
			var current = $('<div>').addClass(this.setClass('time-current'));
			var separator = $('<div>').addClass(this.setClass('time-separator'));
			var total = $('<div>').addClass(this.setClass('time-total'));
			
			time.append(current);
			time.append(separator);
			time.append(total);
			
			return time;
		},
		
		createVolumeBar: function() {
			var volume = $('<div>').addClass(this.setClass('volume'));
			var volumeBtn = $('<div>').addClass(this.setClass('volume-button')).html('Volume');
			var volumeBar = $('<div>').addClass(this.setClass('volume-bar'));
			var volumeIconPlus = $('<div>').addClass(this.setClass('volume-icon-plus')).html('+');
			var volumeWrapper = $('<div>').addClass(this.setClass('volume-wrapper'));
			var volumePosition = $('<div>').addClass(this.setClass('volume-position'));
			var volumeIconLess = $('<div>').addClass(this.setClass('volume-icon-less')).html('-');
			
			volumeWrapper.append(volumePosition);
			
			volumeBar.append(volumeIconPlus);
			volumeBar.append(volumeWrapper);
			volumeBar.append(volumeIconLess);
			
			volume.append(volumeBtn);
			volume.append(volumeBar);
			
			return volume;
		},
		
		formatTime: function(seconds) {
			var minutes = Math.floor(seconds / 60);
			var seconds = Math.round(seconds - (minutes * 60));
			
			if (seconds == 60) {
				seconds = 0;
				minutes = minutes + 1;
			}
			
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			
			return minutes + ':' + seconds;
		},
		
		getClass: function(name) {
			return '.' + this.options.prefix + name;
		},
		
		getControlsSize: function(video) {
			var size = 0;
			var _this = this;
			
			video.parent().find(this.getClass('video-controls')).children().each(function() {
				var element = $(this);
				if (!element.hasClass(_this.setClass('progress-bar'))) {
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
		
		muteVideo: function(video) {
			var volumeButton = video.parent().find(this.getClass('volume-button'));	
			var volumePosition = video.parent().find(this.getClass('volume-position'));
			var video = video.get(0);
			
			if (video.muted) {
				video.muted = false;
				volumeButton.removeClass('muted');
				volumePosition.height(video.volume * 100 + '%');
			}
			else {
				video.muted = true;
				volumeButton.addClass('muted');
				volumePosition.height(0);
			}
		},
		
		playPause: function(video) {
			var videoObj = video.get(0);
			
			if (videoObj.paused) {
				videoObj.play();
			} else {
				videoObj.pause();
			}			
		},
		
		seekTo: function(xPos, progWrapper, video) {
			var progressBar = $(this.getClass('progress-play'));
			var progWidth = Math.max(0, Math.min(1, ( xPos - progWrapper.offset().left ) / progWrapper.width() ));
			
			video.currentTime = progWidth * video.duration;
			
			progressBar.width(progWidth * (progWrapper.width()));
			//this.setCurrentTime(video);
		},
		
		seekVideoSetup: function(video) {
			var progWrapper = $(video).parent().find(this.getClass('progress-wrapper'));
			this.selectable = true;
			
			var _this = this;
			
			progWrapper.bind('mousedown', function(event) {
				event.preventDefault();
				
				_this.toggleSelection();
				
				$('document').bind('mousemove', function(event) {
					event.preventDefault();
					_this.seekTo(event.pageX, progWrapper, video);
				});
				
				
				$('document').bind('mouseup', function(event) {
					event.preventDefault();
					
					_this.toggleSelection();
					
					$('document').unbind('mousemove');
					$('document').unbind('mouseup');
				});
			});
			
			progWrapper.bind('mouseup', function(event) {
				_this.seekTo(event.pageX, progWrapper, video);
			});
		},
		
		setClass: function(name) {
			return this.options.prefix + name;
		},
		
		setProgressEvents: function(video) {
			var _this = this;
			var scrubbing = $(this.getClass('progress-play'));
			var buffer = $(this.getClass('progress-buffer'));
			
			//video.addEventListener('progress', function() { _this.updateVideoData(this, scrubbing); }, true);
			video.addEventListener('seeked', function() {
				if (!video.paused)
					video.play();
			}, true);
			
			video.addEventListener('ended', function() {
				scrubbing.width('100%');
				clearInterval(_this.progressInterval);
			}, true);
			
			video.addEventListener('timeupdate', function() {
				_this.updateVideoData(this, scrubbing);
				_this.updateCurrentTime(this);
			}, false);
			
			video.addEventListener('play', 
				function() { 
					_this.bufferInterval = setInterval(function() { _this.updateBuffer(video, buffer) }, 1000);
					// _this.progressInterval = setInterval(function() { _this.updateVideoData(video, scrubbing); }, 100);
					// _this.updateCurrentTimeInterval = setInterval(function() { _this.updateCurrentTime(video); }, 1000);
					_this.seekVideoSetup(video);
				},
				true
			);
			
			video.addEventListener('pause', function() {
				// clearInterval(_this.progressInterval);
				// clearInterval(_this.updateCurrentTimeInterval);
			}, true);
						
		},
		
		setupProgressBar: function(video) {
			var progressBar = video.parent().find(this.getClass('progress-bar'));
			var controlsSize = progressBar.parent().width() - this.getControlsSize(video);
			
			progressBar.width(controlsSize);
		},
		
		setupTime: function(video) {
			var time = $(video).parent().find(this.getClass('time-display'));
			
			var currentTime = time.find(this.getClass('time-current')).html(this.formatTime(0));
			var totalTime = time.find(this.getClass('time-separator')).html(this.options.timeSeparator);
			var timeSeparator = time.find(this.getClass('time-total')).html(this.formatTime(video.duration));
		},
		
		toggleSelection: function() {
			var _this = this;
			
			if (_this.selectable) {
				$('body').focus();
				$('document').bind('selectstart', function() {
					_this.selectable = false;
					return false;
				});
			}
			else {
				$('document').bind('selectstart', function() {
					_this.selectable = true;
					return true;
				});
			}
		},
		
		updateBuffer: function(video, buffer) {
			if (video.buffered && video.buffered.length == 2) {
				var width = Math.round(Math.ceil(video.buffered.end(0) / video.buffered.end(1) * 100)) + '%';
				buffer.width(width);
			}
			else {
				buffer.width('100%');
				clearInterval(this.bufferInterval);
			}
		},
		
		updateCurrentTime: function(video) {
			var currentTime = $(video).parent().find(this.getClass('time-current'));
			currentTime.html(this.formatTime(video.currentTime));
		},
		
		updateVideoData: function(video, scrubbing) {
			var scrubbingWidth = video.currentTime * 100 / video.duration;
			scrubbing.width(scrubbingWidth + '%');
		},
		
		volumeSetup: function(video) {
			var volWrapper = $(video).parent().find(this.getClass('volume-wrapper'));
			this.selectable = true;
			
			var _this = this;
			
			volWrapper.bind('mousedown', function(event) {
				event.preventDefault();
				
				_this.toggleSelection();
				
				$('document').bind('mousemove', function(event) {
					event.preventDefault();
					_this.volumeTo(event.pageY, volWrapper, video);
				});
				
				
				$('document').bind('mouseup', function(event) {
					event.preventDefault();
					
					_this.toggleSelection();
					
					$('document').unbind('mousemove');
					$('document').unbind('mouseup');
				});
			});
			
			volWrapper.bind('mouseup', function(event) {
				_this.volumeTo(event.pageY, volWrapper, video);
			});
		},
		
		volumeTo: function(yPos, volWrapper, video) {
			var volumeBar = $(this.getClass('volume-position'));
			var volHeight = Math.max(0, Math.min(1, ( yPos - volWrapper.offset().top ) / volWrapper.height() ));
			
			var invertedPercent = (volHeight - 1) * -1;
			video.volume = invertedPercent;
			
			volumeBar.height(invertedPercent * 100 + '%');
			
			var volumeButton = $(this.getClass('volume-button'));
			
			if (invertedPercent <= 0) {
				volumeButton.addClass('muted');
			}
			else {
				volumeButton.removeClass('muted');
			}
		},
		
		wrapVideo: function(video) {
			var _this = this;
			video.wrap('<div>');
			video.parent().addClass(_this.setClass(_this.options.wrapperClass)).attr('id', _this.incrementId())
			

			video.parent().css({
				width: video.width(),
				height: video.height()
			});
		}
	}
	
	$.fn.htmlPlayer = function(options) {
		var defaults = {
			controls: ['play', 'progress', 'time', 'fullscreen'],
			controlsClass: 'video-controls',
			prefix: 'html-player-',
			timeSeparator: '/',
			videoId: 'video-',
			wrapperClass: 'wrapper'
		}
		var options = $.extend(defaults, options);
		return new VideoPlayer(this, options);
	}
})(jQuery);
