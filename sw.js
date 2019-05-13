var	
	appCache = {
		name: 'dpra-v1',
		u: [],
		urls: [
			'assets/css/app.css',
			'assets/css/bootstrap.css',
			'assets/css/fileuploader.css',
			'assets/css/font-style.css',
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
								cache.put(event.request, responseToCache);
							});

						return response;
					}
				);
			})
    );
});