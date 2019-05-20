var	
	appCache = {
		name: 'dpra-v1',
		u: [],
		urls: [
			'index.html',
			'manifest.json',
			'assets/css/app.css',
			'assets/css/bootstrap.css',
			'assets/css/font-style.css',
			'assets/image/favicon.png',
			'assets/image/logo.big.white.png',
			'assets/image/logo.small.white.png',
			'assets/image/marker-blue.png',
			'assets/image/marker-grey.png',
			'assets/image/menu.png',
			'assets/image/icon-192.png',
			'assets/image/icon-512.png',
			'assets/js/app.js',
			'assets/js/bootstrap.min.js',
			'assets/js/datepicker.min.js',
			'assets/js/jquery.min.js',
			'assets/js/loader.js',
			'assets/js/moment.js',
			'assets/js/slider.min.js',
			'assets/js/template.js',
			'assets/js/uploader.js'
		]
	};

self.addEventListener('install', function(event){
	event.waitUntil(
		caches
			.open(appCache.name)
			.then(function(cache){
				return cache.addAll(appCache.urls);
			})
	);
});

self.addEventListener('fetch', function(event){
	const requestURL = new URL(event.request.url);
	
	//if (requestURL.pathname.indexOf('api') > -1) return false;
	if (event.request.method === "POST"){
		console.log('cache skipping because method is POST');
		console.log(requestURL);
		return false;
	}
	
	event.respondWith(
		caches
			.match(event.request)
			.then(function(response){
				// Cache hit - return response
				if (response) return response;

				return fetch(event.request).then(
					function(response){
						// Check if we received a valid response
						if (!response || response.status !== 200 || response.type !== 'basic') return response;

						var responseToCache = response.clone();

						caches
							.open(appCache.name)
							.then(function(cache){
								cache.put(event.request, responseToCache).then(function(a){
									console.log('cache put error');
									console.log(requestURL);
									console.log(a);
								});
							})
							.catch(function(a){
								console.log('cache not found?');
								console.log(requestURL);
								console.log(a);
							});

						return response;
					}
				)
				.catch(function(error){
					console.log('cache match error');
					console.log(requestURL);
					console.log(error);
				});
			})
	);
});