/*
 * © 2019 SlashWebDesign
 */

var debug = false;

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
		//alert(o);
	}
};

function loadScript(source, callback, cache, type){
	var 
		tsNow = new Date().getTime(),
		script = document.createElement('script');

	script.src = (!debug || (source.indexOf('http') > -1)) ? source : source + '?v=' + tsNow;
	script.async = false;
	script.defer = false;
	script.type = type ? type : '';
	script.onerror = function(){
		lg('loading > error loading file [' + source + ']', 'error');
	};
	
	if (typeof callback === 'function') script.onload = callback;

	document.body.appendChild(script);
};

function loadStyle(source, callback, cache){
	var 
		tsNow = new Date().getTime(),
		style = document.createElement('link');

	style.href = !debug ? source : source + '?v=' + tsNow;
	style.rel = 'stylesheet';
	style.type = 'text/css';
	style.onerror = function(){
		lg('loading > error loading file [' + source + ']', 'error');
	};

	if (typeof callback === 'function') style.onload = callback;

	document.getElementsByTagName('head')[0].appendChild(style);
};

window.onerror = function(msg, source, line, col, error){
	lg(msg + ' in ' + source + ' on line ' + line, 'error');
	if (error) lg(error, 'error');
};

loadStyle('assets/css/app.css', null, null);

loadScript('assets/js/jquery.min.js', function(){
	loadScript('assets/js/app.js', null, null, 'module');
});