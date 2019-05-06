/*
 * © 2019 SlashWebDesign
 */

function lg(o, level){
	if (!level) level = 'info';

	if (console)
	{
		switch (level)
		{
			case 'trace': console.log('%c' + o, 'color: #2f68b4'); break;
			case 'error': console.error(o); break;
			case 'warn': console.warn(o); break;
			case 'log':
			case 'info':
			default: console.log(o); break;
		}
	}
};

function loadScript(source, callback, cache, type){
	var 
		tsNow = new Date().getTime(),
		script = document.createElement('script');

	script.src = cache ? source : source + '?v=' + tsNow;
	script.async = false;
	script.defer = false;
	script.type = type ? type : '';
	script.onerror = function(){
		lg('loading > error loading file [' + source + ']', 'error');
	};
	
	if (typeof callback === 'function') script.onload = callback;

	document.getElementsByTagName('body')[0].appendChild(script);
};

function loadStyle(source, callback, cache){
	var 
		tsNow = new Date().getTime(),
		style = document.createElement('link');

	style.href = cache ? source : source + '?v=' + tsNow;
	style.rel = 'stylesheet';
	style.type = 'text/css';
	style.onerror = function(){
		lg('loading > error loading file [' + source + ']', 'error');
		if (typeof callback === 'function') callback();
	};

	document.getElementsByTagName('head')[0].appendChild(style);
};

window.onerror = function(msg, source, line, col, error){
	lg(msg + ' in ' + source + ' on line ' + line, 'error');
	if (error) lg(error, 'error');
};

loadStyle('https://fonts.googleapis.com/css?family=Roboto:300,400,500', true);
loadStyle('assets/css/app.css');

loadScript('assets/js/jquery.min.js', function(){
	loadScript('assets/js/app.js', null, null, 'module');
}, true);