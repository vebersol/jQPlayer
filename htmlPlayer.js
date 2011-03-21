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
			})
		},
		
		createControls: function(video) {
			var wrapper = video.parent();
			wrapper.append('<div class="'+ this.options.controlsClass +'"></div>');
		},
		
		incrementId: function() {
			var id = this.options.videoId + this.idCounter;
			this.idCounter++;
			
			return id;
		},
		
		wrapVideo: function(video) {
			var _this = this;
			video.wrap('<div class="' + _this.options.wrapperClass + '" id="' + _this.incrementId() + '"></div>');
				
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
			videoId: 'video-',
			wrapperClass: 'player-wrapper'
		}
		var options = $.extend(defaults, options);
		return new VideoPlayer(this, options);
	}
})(jQuery);
