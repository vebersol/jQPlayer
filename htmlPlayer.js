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
				_this.setupSubtitles(video);
				
				if (_this.options.onStart) {
					_this.options.onStart.call();
				}
			});
		},
		
		adjustSubtitle: function(video) {
			this.subtitleObj.count = 0;
			this.subtitleObj.current = this.subtitleObj.content[this.subtitleObj.count];
			
			var currentTime = parseFloat(video.currentTime.toFixed(1));
			
			while (this.getMinTime() > currentTime && this.getMaxTime() < currentTime) {
				this.subtitleObj.current = this.subtitleObj.content[this.subtitleObj.current];
				this.subtitleObj.count++;
				
				if (this.subtitleObj.count > this.subtitleObj.content.length-1) {
					this.subtitleObj.count = this.subtitleObj.content.length-1;
					break;
				}
			}
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
		
		changeVideoSource: function(element, video) {
			var currentVersionEl = $(element).parent().parent().parent();
			currentVersion = currentVersionEl.attr('class').replace(this.setClass('alternative-versions') + ' ', '');
			var labelEl = currentVersionEl.find(this.getClass('current-version'));
			var alternative = $(element).parent().attr('class').replace('.' + this.options.prefix + 'alternative-', '');
			
			if (currentVersion != alternative) {
				var version = this.options.alternativeVersions[alternative];
			
				labelEl.html(version.label);
				labelEl.parent().removeClass(currentVersion).addClass(alternative);

				video = video.get(0);
				video.pause();
			
				this.resetVideo(video);
			
				video.src = $.browser.safari ? version.source.mp4 : version.source.ogg;
			
				var _this = this;
			
				video.addEventListener('loadeddata', function() {
					this.play();
				
					if (_this.options.onVideoChange) {
						_this.options.onVideoChange.call();
					}
				
				}, true);
			}
		},
		
		createAlternative: function(video) {
			var defaultVersion = this.extendAlternativeVersions(video);
			
			var element = $('<div class="'+ this.setClass('alternative-versions') +' standard"></div>');
			element.append('<span class="'+this.setClass('current-version')+'">'+defaultVersion.standard.label+'</span>')
			element.append('<ul></ul>');
			
			for (alternative in this.options.alternativeVersions) {
				var alternativeObj = this.options.alternativeVersions[alternative];
				if (alternativeObj.source) {
					var li = $('<li class="'+this.getClass('alternative-' + alternative)+'"><a href="javascript:;"><span></span></a></li>');
					if (alternativeObj.label) {
						li.find('span').html(alternativeObj.label);
					}

					var _this = this;
					li.find('a').bind('click', function() { _this.changeVideoSource(this, video); });
					
					element.find('ul').append(li);
				}
			}
			
			return element;
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
					case 'alternative':
						var alternative = this.createAlternative(video);
						controls.append(alternative);
						break;
					default:
						var customButton = this.createCustomButton(this.options.controls[i]);
						controls.append(customButton);
						break;
				}
			}
			
			wrapper.append(controls);
		},
		
		createCustomButton: function(button) {
			var buttonElement;
			var buttonObj = this.options.customButtons[button];
			if (buttonObj) {
				if (buttonObj.url) {
					buttonElement = $('<div><a href="'+buttonObj.url+'"></a></div>');
					
					if (buttonObj.label)
						buttonElement.find('a').html(buttonObj.label);
						
					if (buttonObj.className)
						buttonElement.addClass(buttonObj.className)
						
					if (buttonObj.target)
						buttonElement.find('a').attr('target', buttonObj.target);
				}
				else if (buttonObj.onclick) {
					buttonElement = $('<div><a href="javascript:;"></a></div>')
					buttonElement.find('a').bind('click', buttonObj.onclick);
					
					if (buttonObj.className)
						buttonElement.addClass(buttonObj.className);
						
					if (buttonObj.label)
						buttonElement.find('a').html(buttonObj.label);
				}
				return buttonElement;
			}
			
			return false;
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
		
		extendAlternativeVersions: function(video) {
			var _this = this;
			var mp4, ogg;
			video.children('source').each(function() {
				if (this.src.search(_this.options.versionsRegex) >= 0) {
					mp4 = this.src;
				}
				else {
					ogg = this.src
				}
			});
			
			defaultVersion = {
				standard: {
					source: {
						mp4: mp4,
						ogg: ogg
					},
					label: 'Standard'
				}
			}
			
			this.options.alternativeVersions = $.extend(this.options.alternativeVersions, defaultVersion);
			
			return defaultVersion;
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
		
		getMaxTime: function() {
			if (typeof(this.subtitleObj.current) != 'undefined') {
				var timeArr = this.subtitleObj.current[1].split(' --> ');
				return this.timecodeToSec(timeArr[1]);
			}
		},
		
		getMinTime: function() {
			if (typeof(this.subtitleObj.current) != 'undefined') {
				var timeArr = this.subtitleObj.current[1].split(' --> ');
				return this.timecodeToSec(timeArr[0]);
			}
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
		
		resetVideo: function(video) {
			var controls = $(video).parent().find(this.getClass('video-controls'));
			controls.find(this.getClass('video-controls') + ', ' + this.getClass('progress-buffer')).css('width', 0);
			clearInterval(this.bufferInterval);
		},
		
		seekTo: function(xPos, progWrapper, video) {
			var progressBar = $(this.getClass('progress-play'));
			var progWidth = Math.max(0, Math.min(1, ( xPos - progWrapper.offset().left ) / progWrapper.width() ));
			
			video.currentTime = progWidth * video.duration;
			
			progressBar.width(progWidth * (progWrapper.width()));
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
			
			video.addEventListener('seeked', function() {
				if (!video.paused)
					video.play();
					
				if (_this.subtitleObj && _this.subtitleObj.loaded) {
					_this.adjustSubtitle(this);
				}
					
				if (_this.options.onSeek) {
					_this.options.onSeek.call();
				}
			}, true);
			
			video.addEventListener('ended', function() {
				scrubbing.width('100%');
				clearInterval(_this.progressInterval);
				
				if (_this.options.onEnd) {
					_this.options.onEnd.call();
				}
				
			}, true);
			
			video.addEventListener('timeupdate', function() {
				_this.updateVideoData(this, scrubbing);
				_this.updateCurrentTime(this);
				
				if (_this.subtitleObj && _this.subtitleObj.loaded) {
					_this.updateSubtitle(video);
				}
				
			}, false);
			
			video.addEventListener('play', 
				function() {
					_this.bufferInterval = setInterval(function() { _this.updateBuffer(video, buffer) }, 1000);
					$(this).parent().find(_this.getClass('play')).removeClass('paused').addClass('playing');
					_this.seekVideoSetup(video);
					
					if (_this.options.onPlay) {
						_this.options.onPlay.call();
					}
				},
				true
			);
			
			 video.addEventListener('pause', function() {
				$(this).parent().find(_this.getClass('play')).removeClass('playing').addClass('paused');
				
				if (_this.options.onPause) {
					_this.options.onPause.call();
				}
			 }, true);
						
		},
		
		setupProgressBar: function(video) {
			var progressBar = video.parent().find(this.getClass('progress-bar'));
			var controlsSize = progressBar.parent().width() - this.getControlsSize(video);
			
			progressBar.width(controlsSize);
		},
		
		setupSubtitles: function(video) {
			var _this = this;
			this.subtitleObj = {}
			
			var src = video.find('track').attr('src');
			
			$.ajax({
				url: src,
				success: function(data) {
					_this.subtitleObj.loaded = true;
					_this.subtitlesToArray(data);
					_this.subtitleObj.count = 0;
					_this.subtitleObj.current = _this.subtitleObj.content[_this.subtitleObj.count];
				}
			});
			
			var subtitleEl = $('<div id="subtitle-'+video.parent().attr('id')+'" class="'+this.setClass('subtitle')+'"></div>');
			var subtitleContent = $('<div class="'+this.setClass('subtitle-content')+'"></div>');
			
			subtitleEl.append(subtitleContent);
			
			this.subtitleObj.element = subtitleEl;
			
			video.parent().append(this.subtitleObj.element);
		},
		
		setupTime: function(video) {
			var time = $(video).parent().find(this.getClass('time-display'));
			
			var currentTime = time.find(this.getClass('time-current')).html(this.formatTime(0));
			var totalTime = time.find(this.getClass('time-separator')).html(this.options.timeSeparator);
			var timeSeparator = time.find(this.getClass('time-total')).html(this.formatTime(video.duration));
		},
		
		subtitlesToArray: function(data) {
			this.subtitleObj.content = [];
			var breakLine = (data.search('\r\n') == -1) ? '\n' : '\r\n';
			var records = data.split(breakLine + breakLine);
			
			for (var i = 0; i < records.length; i++) {
				if (records[i].length > 0) {
					this.subtitleObj.content.push(records[i].split(breakLine));
				}
			};
		},
		
		timecodeToSec: function(tc) {
			if (tc) {
				tc1 = tc.split(',');
				tc2 = tc1[0].split(':');
				seconds = Math.floor(tc2[0] * 60 * 60) + Math.floor(tc2[1] * 60) + Math.floor(tc2[2]);
				
				return seconds;
			}
		},
		
		toFullscreen: function(video) {
			//TODO
			alert('TODO');
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
			if (video.buffered && video.buffered.length > 0) {
				var width = (video.buffered.end(0) / video.duration * 100) + '%';
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
		
		updateSubtitle: function(video) {
			var currentTime = video.currentTime.toFixed(1);
			
			if (currentTime > this.getMinTime() && currentTime < this.getMaxTime()) {
				this.subtitleObj.current = this.subtitleObj.content[this.subtitleObj.count];
				this.subtitleObj.subtitle = this.subtitleObj.current[2];
			} else {
				this.subtitleObj.subtitle = '';
			}
			
			if (currentTime > this.getMaxTime()) {
				this.subtitleObj.count++;
				this.subtitleObj.current = this.subtitleObj.content[this.subtitleObj.count];
			}
			
			this.subtitleObj.element.find('div:first').html(this.subtitleObj.subtitle);
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
			alternativeVersions: {
				hd: {
					source: {
						mp4: 'http://www.mindwork3d.com/video/640x316.mp4',
						ogg: 'http://www.mindwork3d.com/video/640x316.ogv'
					},
					label: 'HD'
				}
			},
			controls: ['play', 'custom_button_1', 'progress', 'time', 'volume', 'fullscreen', 'custom_button_2', 'alternative'],
			controlsClass: 'video-controls',
			customButtons: {},
			onEnd: false,
			onPause: false,
			onPlay: false,
			onSeek: false,
			onStart: false,
			onVideoChange: false,
			prefix: 'html-player-',
			timeSeparator: '/',
			versionsRegex: /mp4|mov/,
			videoId: 'video-',
			wrapperClass: 'wrapper'
		}
		var options = $.extend(defaults, options);
		return new VideoPlayer(this, options);
	}
})(jQuery);
