![logo]

# jQPlayer - HTML 5 Video Player Plugin for jQuery

A jQuery plugin to build custom HTML5 video players.

The main features of this plugin include the ability to customize the player controls and the ability to choose different quality versions of the same video.

Demo: http://jqplayer.vebersol.net/

# Advantages

* More customizable options;
* Callback events for common actions like play, pause, end, etc;
* Custom buttons to add to your player bar;
* Possibility to add different versions (sd, hd) for the same video;
* Easy setup.

# Usage

```html
<!-- Add jQuery and the plugin file in your HTML page -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js" type="text/javascript"></script>
<script src="jquery-jqplayer-0.5.0.js" type="text/javascript"></script>

<!-- Create an HTML element -->
<div id="video-element"><!-- --></div>

<!-- Setup the plugin and enjoy yourself! -->
<script type="text/javascript">
  $(function() {
  	
		var options = {
			videos: {
				standard: {
					source: {
						mp4: 'movie.mp4',
						webm: 'movie.webm'
					},
					label: 'SD'
				}
			}
		};
		
		$('#video-element').jQPlayer(options);
	});
</script>
```

# API

#### $.jQPlayer(options)

This method is used to build the player.

##### Options

* **controls:** (Array)  
Set and order all available and custom controls.  
By removing one of them, you will hide it from player.  
*Default value: ['play', 'progress', 'time', 'volume', 'fullscreen', 'alternative']*

* **controlsClass:** (String)  
Add a custom class to video player controls.  
*Default value: 'video-controls'*

* **customButtons:** (Object)  
An object that receives all custom buttons.  
*Default value: {}*

* **defaultVideo:** (String)  
Set the default video to be loaded on initialization.  
*Default value: 'standard'*

* **floatControls:** (Boolean)  
To be defined.  
*Default value: false*

* **onEnd:** (Function)  
A function that will be executed on video end.  
*Default value: false*

* **onPause:** (Function)  
A function that will be executed on video pause.  
*Default value: false*

* **onPlay:** (Function)  
A function that will be executed on video play.  
*Default value: false*

* **onSeek:** (Function)  
A function that will be executed on video seek.  
*Default value: false*

* **onStart:** (Function)  
A function that will be executed on video start.  
*Default value: false*

* **onVideoChange:** (Function)  
A function that will be executed on video change.  
*Default value: false*

* **prefix:** (String)  
A prefix to add for all used classes on the used HTML.  
*Default value: 'html-player-'*

* **timeSeparator:** (String)  
A saparator to be used between current time and duration time.  
*Default value: '/'*

* **videoId:** (String)  
Video element will assume an id like 'videoId' + incremental integer.  
*Default value: 'video-'*

# Developers

This plugin has been developed by [Vinícius Ebersol][ve].

[Thiago Reis][tr] designed the concept and final layout of this player.

# Contributing

If you want to contribute, please feel free, we encourage you to do this.

# Reporting bugs

Any bug report, please, see this link: https://github.com/vebersol/jQPlayer/issues

[ve]: http://vebersol.net
[tr]: http://www.thiagoreis.com/
[logo]: http://vebersol.net/logo.jpg