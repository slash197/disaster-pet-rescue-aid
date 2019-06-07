/*
 * © 2019 SlashWebDesign
 */
import {PageTemplate, MapStyle} from './template.js';

var DPRA = function(){
	
	this.categories = [];
	this.colors = [];
	this.disasters = [];
	this.breeds = [];
	this.list = [];
	this.category_id = 0;
	this.filters = {
		disaster_id: '0',
		breed_id: '0',
		color_primary: 'any',
		color_secondary: 'any',
		gender: 'any',
		hair: 'any',
		patterns: 'solid',
		altered: 'no'
	};
	this.page = '';
	this.user = {
		id: null,
		token: null
	};
	this.scrollTop = 0;
	this.position = {
		status: false,
		lat: 0.00,
		lng: 0.00
	};
	this.profileSlider = null;
	this.map = null;
	this.mapData = [];
	this.marker = null;
	this.markers = [];
	this.popupEvent = 0;
	this.pageState = null;
	this.categoryItemWidth = 0;
	
	this.pushState = function(state){
		history.pushState(state, 'title', 'index.html');
		this.pageState = state;
		
		//lg('pushed state');
		//lg(state);
	};
	
	this.getCurrentPosition = function(callback){
		navigator.geolocation.getCurrentPosition(
			function(r){
				this.position = {
					status: true,
					lat: r.coords.latitude,
					lng: r.coords.longitude
				};
				if (typeof callback === 'function') callback();
			}.bind(this),
			function(r){
				switch (r.code)
				{
					case 1:
						this.notify('Please enable location services to use this app [' + r.message + ']', 'error');
						lg(r);
						break;
					case 2:
						this.notify('Location not available at the moment, try again later', 'error');
						break;
					case 3:
						this.notify('Location service timed out', 'error');
						break;
				}
			}.bind(this),
			{
				maximumAge: 86400,
				timeout: 20000,
				enableHighAccuracy: true
			}
		);
	};
	
	this.getPosition = function(callback){
		if (navigator.permission && navigator.permission.query)
		{
			navigator.permissions.query({'name': 'geolocation'}).then(function(q){
				//lg('current permission settings');
				//lg(q);

				switch (q.state)
				{
					case 'granted':
					case 'prompt':
						this.getCurrentPosition(callback);
						break;

					case 'denied':
						this.notify('Please enable Location services to use this app', 'error');
						lg(q);
						break;					
				}
			}.bind(this));
		}
		else
		{
			this.getCurrentPosition(callback);
		}
	};
	
	this.signIn = function(){
		if (!this.validate(['email', 'password'])) return false;
		
		xhr({
			data: {
				path: 'login',
				email: $('input[name="email"]').val(),
				password: $('input[name="password"]').val()
			},
			success: function(r){
				if (r.status)
				{
					this.user = {
						id: r.id,
						token: r.token
					};

					window.localStorage.setItem('dpra.user', JSON.stringify(this.user));
					
					this.auth();
				}
				else
				{
					this.notify(r.error, 'error');
				}
			}.bind(this)
		});
	};
	
	this.signUp = function(){
		if (!this.validate(['email', 'password'])) return false;
		
		xhr({
			data: {
				path: 'register',
				email: $('input[name="email"]').val(),
				password: $('input[name="password"]').val()
			},
			success: function(r){
				this.user = {
					id: r.id,
					token: r.token
				};

				window.localStorage.setItem('dpra.user', JSON.stringify(this.user));
				
				this.auth();
			}.bind(this)
		});
	};
	
	this.showPreview = function(e){
		$('.results .preview').remove();
		
		var 
			item = this.list[e.attr('data-id')],
			index = $('.results .item').index(e),
			date = moment(parseInt(item.date, 10) * 1000),
			breed = this.getBreed(item.breed_id),
			r = Math.floor(index / 3) + 1,
			html = '';

		html = 
				'<section class="preview">' +
					'<div class="name">' + item.name + '</div>' +
					'<div class="props">' + breed + ', ' + item.color + '</div>' +
					'<div class="date">Reported on ' + date.format('MMMM D, YYYY') + '</div>' +
					'<button class="btn btn-small btn-white btn-view" data-id="' + e.attr('data-id') + '">view</button>' +
				'</section>';
		
		if ($('.results .item:eq(' + (r * 3 - 1) + ')').length)
		{
			$(html).insertAfter('.results .item:eq(' + (r * 3 - 1) + ')');
		}
		else
		{
			$(html).insertAfter('.results .item:last-child');
		}
	};
	
	this.hidePreview = function(){
		$('.results .preview').remove();
	};
	
	this.buildColorFilterString = function(type){
		var 
			str = '',
			temp = App.filters[type].split('|');
		
		for (var i = 0; i < temp.length; i++)
		{
			if (i !== 0) str += ' OR ';
			str += type + ' LIKE "%' + temp[i] + '%"';
		}
		
		return str;
	};
	
	this.buildFilterString = function(){
		var str = '';
		
		if (App.filters.disaster_id !== '0') str += ' AND disaster_id = ' + App.filters.disaster_id;
		if (App.filters.breed_id !== '0') str += ' AND breed_id = ' + App.filters.breed_id;
		if (App.filters.color_primary !== 'any') str += ' AND (' + App.buildColorFilterString('color_primary') + ')';
		if (App.filters.color_secondary !== 'any') str += ' AND (' + App.buildColorFilterString('color_secondary') + ')';
		if (App.filters.gender !== 'any') str += ' AND gender = "' + App.filters.gender + '"';
		if (App.filters.hair !== 'any') str += ' AND hair = "' + App.filters.hair + '"';
		if (App.filters.altered !== 'unknown') str += ' AND altered = "' + App.filters.altered + '"';
		str += ' AND patterns = "' + App.filters.patterns + '"';
		
		return str;
	};
	
	this.updateFilterLabel = function(){
		var label = '';
		
		if (App.filters.breed_id !== '0') label += this.getBreed(App.filters.breed_id) + '; ';
		if (App.filters.color_primary !== 'any') label += App.filters.color_primary.replaceAll('|', ', ') + ' color; ';
		if (App.filters.hair !== 'any') label += App.filters.hair + ' hair; ';
		if (App.filters.gender !== 'any') label += App.filters.gender + ';';
		if (App.filters.altered !== 'unknown') label += App.filters.altered + ';';
		label += App.filters.patterns + ';';
		
		if (label === '') label = 'Filters';
		
		$('.btn-filter .selection').html(label);
	};
	
	this.getLocation = function(id){		
		$('.profile .location').html('<div class="spinner-holder"><div class="spinner s60 blue"></div></div>');
		xhr({
			data: {
				path: 'location/get',
				fields: '*',
				filter: 'report_id = ' + id,
				order: 'date DESC'
			},
			success: function(r){
				$('.profile .location').html('');

				for (var i = 0; i < r.data.length; i++)
				{
					var 
						item = r.data[i],
						date = moment(parseInt(item.date, 10) * 1000);
					
					$('.profile .location').append(
						'<div class="item" data-lat="' + item.lat + '" data-lng="' + item.lng + '">' +
							'<span class="ico ico-location-on"></span>' +
							'<div>' +
								'<p>' + item.address + '</p>' +
								'<p>' + date.format('HH:mm on MMMM D, YYYY') + '</p>' +
							'</div>' +
						'</div>'
					);
				}
			}.bind(this)
		});
	};
	
	this.renderReports = function(){
		$('.reports .items').html('<div class="spinner-holder"><div class="spinner s60 blue"></div></div>');
		
		xhr({
			data: {
				path: 'report/get',
				filter: 'member_id = ' + this.user.id,
				fields: '*',
				order: 'date DESC'
			},
			success: function(r){
				this.list = this.processList(r.data);
				
				$('.reports .spinner-holder').remove();
				
				for (var id in this.list)
				{
					var 
						item = this.list[id],
						date = moment(parseInt(item.date, 10) * 1000);
					
					$('.reports .items').append(
						'<div class="item" data-id="' + item.report_id + '">' +
							'<div class="img" style="background-image: url(upload/' + item.files[0] + ')"></div>' +
							'<div class="data">' +
								'<p class="status">' + item.type + '</p>' +
								'<p class="date">' + date.format('HH:mm on MMMM D, YYYY') + '</p>' +
							'</div>' +
						'</div>'
					);
				}
				
				if (!r.data.length)
				{
					$('.reports .items').html('<p class="empty">No results found</p>');
				}
			}.bind(this)
		});
	};
	
	this.reports = function(){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.reports);
			App.renderReports();
		});
	};
	
	this.renderSelectDisasters = function(){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.disasters);
			$('.tab div:first').trigger('click');
		}.bind(this));
	};
	
	this.renderDisasterType = function(type){
		var 
			check = '',
			html = '';

		for (var i = 0; i < this.disasters.length; i++)
		{
			if (this.disasters[i].type === type)
			{
				check = (App.filters.disaster_id === this.disasters[i].disaster_id) ? '<span class="ico ico-check"></span>' : '';
				html += '<div class="item" data-id="' + this.disasters[i].disaster_id + '" style="background-image: url(assets/image/disaster.jpg)"><div>' + check + this.disasters[i].name + ' (23)</div></div>';
			}
		}

		$('.home .disasters').html(html);
	};
	
	this.renderHome = function(){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.home);
		});
	};
	
	this.onClickMarker = function(){
		var 
			marker = this,
			item = App.mapData[marker.id],
			date = moment(parseInt(item.date, 10) * 1000);
		
		App.popupEvent = moment().unix();
		
		$('.map-popup .image').css('background-image', 'url(upload/' + item.files[0] + ')');
		$('.map-popup .props .breed span').html(App.getBreed(item.breed_id));
		$('.map-popup .props .gender span').html(item.gender);
		$('.map-popup .props .color span').html(item.color.replaceAll('|', '<br />'));
		$('.map-popup .props .hair span').html(item.hair);
		$('.map-popup .location').html(
			'<p>' + item.address + '</p>' +
			'<p>' + date.format('HH:mm on MMMM D, YYYY') + '</p>'
		);

		$('.map-popup-overlay').show();
		$('.map-popup').removeClass('shrink').addClass('grow');
	};
	
	this.renderMap = function(preselect){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.map);
			this.renderCategories(preselect);
		}.bind(this));
	};
	
	this.renderLocations = function(){
		if (!App.position.status)
		{
			this.getPosition(this.renderLocations.bind(this));
			return false;
		}
		
		$('.results').html('<div class="spinner-holder"><div class="spinner s60 blue"></div></div>');
		
		this.category_id = $('.map-categories .item.active').attr('data-id');
		
		xhr({
			data: {
				path: 'query',
				sql: 'SELECT l.location_id, l.lat, l.lng, l.date, l.address, r.report_id, r.name, r.files, r.color, r.breed_id, r.hair, r.gender FROM location l, report r WHERE l.report_id = r.report_id AND r.category_id = ' + this.category_id + ' ORDER BY l.date DESC'
			},
			success: function(r){
				$('.spinner-holder').remove();
				
				this.mapData = this.processMapData(r.data);
				this.map = new google.maps.Map(document.getElementById('map'), {
					center: {
						lat: App.position.lat,
						lng: App.position.lng
					},
					zoom: App.position.status ? 15 : 1,
					zoomControl: false,
					mapTypeControl: false,
					scaleControl: false,
					streetViewControl: false,
					rotateControl: false,
					fullscreenControl: false,
					styles: MapStyle
				});
				
				for (var i = 0; i < r.data.length; i++)
				{
					var 
						item = r.data[i],
						marker = new google.maps.Marker({
							position: {
								lat: parseFloat(item.lat),
								lng: parseFloat(item.lng)
							},
							map: this.map,
							icon: this.marker.blue,
							id: item.location_id
						});
						
					marker.addListener('click', this.onClickMarker);
						
					this.markers.push(marker);
				}
				
				if (!r.data.length)
				{
					$('.results').html('<p class="empty">No results found</p>');
				}
			}.bind(this)
		});
	};
	
	this.renderProfile = function(id){
		var 
			images = '',
			progress = '',
			item = this.list[id];
		
		for (var i = 0; i < item.files.length; i++)
		{
			images += '<div class="swiper-slide" style="background-image: url(upload/' + item.files[i] + ')"></div>';
			progress += '<div class="bar" style="width: ' + (100 / item.files.length) + '%"></div>';
		}
		
		$('.swiper-wrapper').html(images);
		$('.profile .progress').html(progress);
		$('.profile .name').html(item.name);
		$('.profile .props .breed span').html(this.getBreed(item.breed_id));
		$('.profile .props .gender span').html(item.gender);
		$('.profile .props .color span').html(item.color.replaceAll('|', '<br />'));
		$('.profile .props .hair span').html(item.hair);
		$('.profile .description').html(item.description);

		this.getLocation(id);
		
		if (this.profileSlider) this.profileSlider.destroy();
		
		this.profileSlider = new Swiper('.swiper-container', {
			loop: item.files.length > 1,
			autoplay: item.files.length > 1,
			on: {
				slideChange: function(){
					$('.profile .progress .bar').removeClass('active');
					$('.profile .progress .bar:eq(' + this.realIndex + ')').addClass('active');
				}
			}
		});
	};
	
	this.renderResults = function(){
		$('.results').html('<div class="spinner-holder"><div class="spinner s60 blue"></div></div>');
		
		this.category_id = $('.categories .item.active').attr('data-id');
		
		xhr({
			data: {
				path: 'breed/get',
				fields: 'breed_id, name',
				filter: 'category_id = ' + this.category_id,
				order: 'sort_order ASC'
			},
			success: function(r){
				this.breeds = r.data;
				this.renderBreeds();
			}.bind(this)
		});
		
		xhr({
			data: {
				path: 'report/get',
				fields: 'report_id, name, description, breed_id, disaster_id, color_primary, color_secondary, patterns, gender, hair, microchip, altered, files, date',
				filter: 'type = "' + this.page + '" AND status = "approved" AND category_id = ' + this.category_id + this.buildFilterString(),
				order: 'date DESC'
			},
			success: function(r){
				$('.spinner-holder').remove();
				
				this.list = this.processList(r.data);
				
				for (var id in this.list)
				{
					var item = this.list[id];
					
					$('.results').append(
						'<div class="item" data-id="' + id + '">' +
							'<img src="upload/' + item.files[0] + '" alt="item" />' +
							'<div class="border"><>/div' +
						'</div>'
					);
				}
				
				if (!Object.keys(this.list).length)
				{
					$('.results').html('<p class="empty">No results found</p>');
				}
			}.bind(this)
		});
	};
	
	this.renderCategories = function(preselect){
		var 
			html = '',
			c = null;
	
		for (var i = 0; i < this.categories.length; i++)
		{
			c = this.categories[i];
			html += '<div class="item" data-id="' + c.category_id + '">' + c.name + '</div>';
		}
		
		$('.map-categories, .categories').html('<div class="scroller">' + html + '<span class="ico ico-keyboard-arrow-left"></span><span class="ico ico-keyboard-arrow-right"></span></div>');
		
		if (preselect)
		{
			$('.map-categories .scroller .item[data-id="' + this.category_id + '"], .categories .scroller .item:first-child').trigger('click');
		}
		else
		{
			$('.map-categories .scroller .item:first-child, .categories .scroller .item:first-child').trigger('click');
		}
		
		this.categoryItemWidth = 0;
		$('.scroller .item').each(function(){
			App.categoryItemWidth += $(this).outerWidth(true);
		});

		$('.scroller').scroll(function(){
			App.renderCategoryListControls();
		});
		
		this.renderCategoryListControls();
	};
	
	this.renderCategoryListControls = function(){
		var 
			max = this.categoryItemWidth - $('.categories').width() - 1,
			pos = $('.categories .scroller').get(0).scrollLeft;
		
		if (pos < 1)
		{
			$('.categories .ico-keyboard-arrow-left').hide();
		}
			
		if (pos > 1) 
		{
			$('.categories .ico-keyboard-arrow-left').show();
		}
		
		if (pos > max)
		{
			$('.categories .ico-keyboard-arrow-right').hide();
		}
		
		if (pos < max)
		{
			$('.categories .ico-keyboard-arrow-right').show();			
		}
		
		lg(max);
		lg(pos);
	};
	
	this.renderList = function(type){
		this.page = type;
		
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.list);
		
			$('.list .header .title').html(type.ucFirst());
			
			switch (type)
			{
				case 'seen':
				case 'missing':
				case 'found':
					$('.create-button').show();
					break;
				
				default:
					$('.create-button').hide();
			}
			
			this.renderCategories();
		}.bind(this));
	};
	
	this.renderSignUp = function(){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.signUp);
		});
	};
	
	this.renderSignIn = function(){
		this.fadeScreen(function(){
			$('#app').html(PageTemplate.signIn);
		});
	};
	
	this.renderColors = function(){
		var html = '';
		
		for (var i = 0; i < this.colors.length; i++)
		{
			html += '<span class="option">' + this.colors[i].name + '</span>';
		}
		
		$('[data-tag="color_primary"], [data-tag="color_secondary"]').append(html);
	};
	
	this.renderDisasters = function(){
		var html = '';
		
		for (var i = 0; i < this.disasters.length; i++)
		{
			html += '<li data-id="' + this.disasters[i].disaster_id + '">' + this.disasters[i].name + '</li>';
		}
		
		$('.filter .dropdown[data-tag="disaster"] ul').html('<li data-id="0">any</li>' + html);
		$('.filter .dropdown[data-tag="disaster"] ul li:first-child').trigger('click');
		
		$('.create .dropdown[data-tag="disaster"] ul').html(html);
		$('.create .dropdown[data-tag="disaster"] ul li:first-child').trigger('click');
	};
	
	this.renderBreeds = function(){
		var html = '';
		
		for (var i = 0; i < this.breeds.length; i++)
		{
			html += '<li data-id="' + this.breeds[i].breed_id + '">' + this.breeds[i].name + '</span>';
		}
		
		$('.filter .dropdown[data-tag="breed"] .selection').html('').attr('data-id', '0');
		$('.filter .dropdown[data-tag="breed"] ul').html('<li data-id="0">any</li>' + html);
		$('.filter .dropdown[data-tag="breed"] ul li[data-id="' + App.filters.breed_id + '"]').trigger('click');
		
		$('.create .dropdown[data-tag="breed"] .selection').html('').attr('data-id', '0');
		$('.create .dropdown[data-tag="breed"] ul').html(html);
		$('.create .dropdown[data-tag="breed"] ul li:first-child').trigger('click');
	};
	
	this.getBreed = function(id){
		for (var i = 0; i < this.breeds.length; i++)
		{
			if (this.breeds[i].breed_id === id) return this.breeds[i].name;
		}
		
		return 'N/A';
	};
	
	this.toggleMenu = function(){
		if ($('.notify').position().top > 0) return false;
		
		if (Math.round($('.menu').position().left) === -245)
		{
			App.pushState({page: 'menu'});
			$('.menu-overlay').show().animate({opacity: 1}, 300);
			$('.menu').animate({left: 0}, 300);
		}
		else
		{
			$('.menu-overlay').hide().css({opacity: 0});
			$('.menu').animate({left: -245}, 100);
		}
	};
	
	this.toggleProfile = function(){
		if (Math.round($('.profile').position().top) !== 0)
		{
			App.pushState({page: 'profile'});
			$('.profile').animate({top: 0}, 300);
		}
		else
		{
			$('.profile').animate({top: '-100%'}, 100);
		}
	};
	
	this.toggleFilters = function(){
		if (Math.round($('.filter').position().top) !== 0)
		{
			App.pushState({page: 'filter'});
			$('.filter').animate({top: 0}, 300);
		}
		else
		{
			$('.filter').animate({top: '-100%'}, 100);
		}
	};
	
	this.toggleForm = function(){
		if (Math.round($('.create').position().top) !== 0)
		{
			App.pushState({page: 'create'});
			this.getPosition();
			
			$('.list .header').hide();
			$('.create').scrollTop(0);
			$('.create h1').html('Create ' + this.page + ' pet report');
			$('.create input, .create textarea').val('');
			$('.create [data-tag="files"] span').remove();
			$('.btn-upload').css('background-image', 'none');
			$('.uploads').html('');
			$('.create').animate({top: 0}, 300);
		}
		else
		{			
			$('.list .header').show();
			$('.create').animate({top: '-100%'}, 100);
		}
	};
	
	this.processList = function(data){
		var out = {};
		
		for (var i = 0; i < data.length; i++)
		{
			var temp = data[i];
			
			out[temp.report_id] = temp;
			out[temp.report_id]['files'] = temp.files.split('|');
		}
		
		return out;
	};
	
	this.processMapData = function(data){
		var out = {};
		
		for (var i = 0; i < data.length; i++)
		{
			var temp = data[i];
			
			out[temp.location_id] = temp;
			out[temp.location_id]['files'] = temp.files.split('|');
		}
		
		return out;
	};
	
	this.validate = function(form){
		for (var i = 0; i < form.length; i++)
		{
			if ($('[name="' + form[i] + '"]').length)
			{
				if ($('[name="' + form[i] + '"]').val() === '')
				{
					this.notify('Please fill in the ' + form[i] + ' field', 'error');				
					return false;
				}
			}
			else
			{
				if ($('.create .field[data-tag="' + form[i] + '"] .option.selected').length < 1)
				{
					var message = (form[i] === 'files') ? 'Please upload at least one image' : 'Please select at least one ' + form[i] + ' option';
					this.notify(message, 'error');				
					return false;
				}
			}
		}
		
		return true;
	};
	
	this.fadeScreen = function(callback){
		$('#app').animate({opacity: 0}, 250, function(){
			callback();
			$('#app').animate({opacity: 1}, 100);
		});
	};
	
	this.option2param = function(tag, selector){
		var 
			param = [],
			field = $('.' + selector + ' .field[data-tag="' + tag + '"]');
		
		field.find('.option.selected').each(function(){
			param.push($(this).text());
		});
		
		if (!param.length)
		{
			param.push($('.' + selector + ' .dropdown[data-tag="' + tag + '"] .selection').attr('data-id'));
		}
		
		return param.join('|');
	};
	
	this.notify = function(text, type, btns){
		if (!btns) btns = [{label: 'OK', cls: 'btn-blue', callback: null}];
		
		for (var i = 0; i < btns.length; i++)
		{
			$('.notify p').append('<button class="btn btn-small ' + btns[i].cls + ' btn-' + i + '">' + btns[i].label + '</button>');
			$('.notify p .btn-' + i).on('click', btns[i].callback);
			$('.notify p .btn').on('click', App.notifyClose);
		}
		
		$('.notify .message').html(text);
		
		$('.menu-overlay').show().animate({opacity: 1}, 300);
		$('.notify').animate({top: '40%'}, 300);
	};
	
	this.notifyClose = function(){
		$('.menu-overlay').hide().css({opacity: 0});
		$('.notify').animate({top: '-40%'}, 100);
		
		$('.notify p .btn').off('click');
		$('.notify p').html('');
	};
	
	this.fetchResources = function(){
		loadStyle('assets/css/bootstrap.css', null, true);
		loadStyle('assets/css/font-style.css', null, true);

		loadScript('assets/js/jquery.min.js', function(){
			loadScript('assets/js/bootstrap.min.js', function(){
				loadScript('assets/js/datepicker.min.js', function(){
					loadScript('assets/js/moment.js', function(){
						loadScript('assets/js/slider.min.js', function(){
							loadScript('assets/js/uploader.js', function(){
								loadScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCpweMS0nZ3odzmeXAkEUjZRqIPBnhVE0o', function(){
									$('.splash h1').show();
									
									xhr({
										data: {
											path: 'disaster/get',
											fields: 'disaster_id, name, type',
											filter: '1 = 1',
											order: 'sort_order ASC'
										},
										success: function(r){
											App.disasters = r.data;
											App.renderDisasters();
										}
									});

									xhr({
										data: {
											path: 'color/get',
											fields: 'name',
											filter: '1 = 1',
											order: 'sort_order ASC'
										},
										success: function(r){
											App.colors = r.data;
											App.renderColors();
										}
									});

									xhr({
										data: {
											path: 'category/get',
											fields: 'category_id, name',
											filter: '1 = 1',
											order: 'sort_order ASC'
										},
										success: function(r){
											App.categories = r.data;
											App.afterLoaded();
										}
									});
									});
							});
						});
					});
				});
			});
		}, true);
	};
	
	this.afterLoaded = function(){
		// all resources are loaded
		$('.splash .spinner-holder').remove();
		$('.menu, .create, .notify, .filter, .profile').show();
		
		$('.create .btn-upload').dmUploader({
			url: 'api/upload',
			dnd: false,
			allowedTypes: 'image/*',
			extFilter: ["jpg", "jpeg", "png"],
			onUploadProgress: function(id, percent){
				$('.btn-upload .progress .bar').css('width', percent + '%');
			},
			onUploadSuccess: function(id, data){
				$('.btn-upload .progress .bar').css('width', 0 + '%');
				
				var r = JSON.parse(data);
				
				$('.create [data-tag="files"]').append('<span class="option selected">' + r.path + '</span>');
				
				if ($('.btn-upload').css('background-image') === 'none')
				{
					$('.btn-upload').css({
						'background-image': 'url(upload/' + r.path + ')',
						'background-size': 'cover',
						'background-position': 'center center'
					});
				}
				
				$('.uploads').append('<div data-path="' + r.path + '" style="background-image: url(upload/' + r.path + ')"><span class="ico ico-delete"></span></div>');
			},
			onUploadError: function(id, xhr, status, error){
				$('.btn-upload .progress .bar').css('width', 0 + '%');
				lg('error');
				lg(status);
				lg(error);
			},
			onFileTypeError: function(file){
				App.notify('Invalid file type', 'error');
			},
			onFileSizeError: function(file){
				App.notify('File is too large', 'error');
			},
			onFileExtError: function(file){
				App.notify('Invalid file type', 'error');
			}
		});
		
		this.marker = {
			grey: {
				url: 'assets/image/marker-grey.png',
				size: new google.maps.Size(25, 36),
				anchor: new google.maps.Point(12, 35)
			},
			blue: {
				url: 'assets/image/marker-blue.png',
				size: new google.maps.Size(25, 36),
				anchor: new google.maps.Point(12, 35)
			}
		};
		this.auth();
	};
	
	this.logout = function(){
		window.localStorage.setItem('dpra.user', null);
		this.fadeScreen(function(){
			this.splash();
			this.auth();
		}.bind(this));
	};
	
	this.init = function(){
		if ('serviceWorker' in navigator)
		{
			//window.addEventListener('load', function(){
			//	navigator.serviceWorker.register('sw.js').then(function(registration){
					//lg('ServiceWorker registration successful with scope: ', registration.scope);
			//	}, function(err){
			//		lg('ServiceWorker registration failed: ', err);
			//	});
			//});
		}
		
		this.pushState({page: 'list'});
		this.splash();
		this.fetchResources();
	};

	this.splash = function(){
		$('#app').html(
			'<div class="splash">' +
				'<div><img src="assets/image/logo.big.white.png" alt="logo" /></div>' +
				'<h1><span>disaster</span><span>pet rescue</span><span>aid</span></h1>' +
			'</div>'
		);
	};
	
	this.auth = function(){
		$('.splash h1').show();
		
		var temp = JSON.parse(window.localStorage.getItem('dpra.user') || null);

		if (!temp)
		{
			$('html').addClass('bg-gradient');
			$('.splash').append(
				'<p><button class="btn btn-white btn-sign-up">sign up</button></p>' +
				'<p><button class="btn btn-blue btn-sign-in">sign in</button></p>'
			);
		}
		else
		{
			$('html').removeClass('bg-gradient');
			this.user = temp;
			this.renderHome();
		}
	};
	
	this.init();
};

var App = new DPRA();

window.addEventListener('popstate', function(event){
	return false;
	//lg('pop state');
	//lg(App.pageState);

	//if (event.state === null) return false;
	
	switch (App.pageState.page)
	{
		case 'create':
			App.toggleForm();
			break;
		case 'filter':
			App.toggleFilters();
			break;
		case 'profile':
			App.toggleProfile();
			break;
		case 'menu':
			App.toggleMenu();
			break;
	}
	
	App.pageState = event.state;
});

$(document).on('click', '.home .tab div', function(){
	$('.home .tab div').removeClass('active');
	$(this).addClass('active');
	App.renderDisasterType($(this).attr('data-type'));
});

$(document).on('click', '.home .disasters .item', function(){
	$('.home .disasters .item .ico-check').remove();
	$(this).prepend('<span class="ico ico-check"></span>');
	
	App.filters.disaster_id = $(this).attr('data-id');
	App.renderList('missing');
});

$(document).on('click', '.home .btn-continue', function(){
	App.renderSelectDisasters();
});

$(document).on('click', '.uploads div', function(){
	var 
		img = $(this),
		index = img.index(),
		path = img.attr('data-path');
	
	xhr({
		data: {
			path: 'remove-image',
			url: path
		},
		success: function(){
			img.remove();

			if (index === 0)
			{
				$('.btn-upload').css({
					'background-image': $('.uploads div').length ? 'url(upload/' + $('.uploads div:first-child').attr('data-path') + ')' : 'none'
				});
			}
		}
	});
});

$(document).on('click', '.preview .btn-view, .reports .item', function(){
	App.toggleProfile();
	App.renderProfile($(this).attr('data-id'));
});

$(document).on('click', '.profile .location .item', function(){
	App.toggleProfile();
	App.renderMap(true);
	
	window.setTimeout(function(){
		if (App.map) App.map.setCenter({lat: parseFloat($(this).attr('data-lat')), lng: parseFloat($(this).attr('data-lng'))});
	}, 2000);
});

$(document).on('click', '.profile .ico-keyboard-arrow-left', App.toggleProfile);

$(document).on('click', '.dropdown ul li', function(e){
	$(this).parent().parent().find('.selection').html($(this).text()).attr('data-id', $(this).attr('data-id'));
});

$(document).on('click', '.dropdown .selection', function(e){
	e.stopPropagation();
	$('body').trigger('click');
	$(this).parent().find('ul').show().scrollTop(0);
});

$(document).on('click', 'body', function(){
	$('.dropdown ul').hide();
	
	var diff = moment().unix() - App.popupEvent;
	
	if ((diff > 1) && $('.map-popup').hasClass('grow'))
	{
		$('.map-popup').removeClass('grow').addClass('shrink');
		$('.map-popup-overlay').hide();
	}
});

$(document).on('click', '.results .item', function(){
	if ($(this).hasClass('active'))
	{
		$(this).removeClass('active');
		App.hidePreview($(this));
	}
	else
	{
		$('.results .item').removeClass('active');
		$(this).addClass('active');

		App.showPreview($(this));
	}
});

$(document).on('click', '.btn-filter', App.toggleFilters);

$(document).on('click', '.filter .btn-apply', function(){
	App.toggleFilters();
	
	App.filters = {
		disaster_id: App.filters.disaster_id,
		breed_id: App.option2param('breed', 'filter'),
		color_primary: App.option2param('color_primary', 'filter'),
		color_secondary: App.option2param('color_secondary', 'filter'),
		gender: App.option2param('gender', 'filter'),
		hair: App.option2param('hair', 'filter'),
		patterns: App.option2param('patterns', 'filter'),
		altered: App.option2param('altered', 'filter')
	};
	
	App.updateFilterLabel();
	
	$('.categories .item[data-id="' + App.category_id + '"]').trigger('click');	
});

$(document).on('click', '.create-button', App.toggleForm.bind(App));

$(document).on('click', '.create .btn-cancel', App.toggleForm);

$(document).on('click', '.create .btn-create', function(){
	if (!App.validate(['files', 'name', 'description', 'color'])) return false;
	
	if (!App.position.status)
	{
		App.notify('Please enable Location services to upload your report', 'error');
		return false;
	}

	xhr({
		data: {
			path: 'report/create',
			data: {
				name: $('[name="name"]').val(),
				breed: $('[name="breed"]').val(),
				color_primary: App.option2param('color_primary', 'create'),
				color_secondary: App.option2param('color_secondary', 'create'),
				files: App.option2param('files', 'create'),
				description: $('[name="description"]').val(),
				microchip: $('[name="microchip"]').val(),
				hair: App.option2param('hair', 'create'),
				gender: App.option2param('gender', 'create'),
				altered: App.option2param('altered', 'create'),
				patterns: App.option2param('patterns', 'create'),
				date: moment().unix(),
				member_id: App.user.id,
				category_id: App.category_id,
				disaster_id: App.option2param('disaster', 'create'),
				breed_id: App.option2param('breed', 'create'),
				status: 'approved',
				type: App.page
			}
		},
		success: function(r){
			$('.categories .item.active').trigger('click');
			
			App.toggleForm();
			App.notify('Your report has been sent successfully');
			
			xhr({
				data: {
					path: 'location/create',
					data: {
						report_id: r.id,
						lat: App.position.lat,
						lng: App.position.lng,
						date: moment().unix()
					}
				},
				success: function(r){
					lg(r);
				}
			});
		}
	});
});

$(document).on('click', '.option', function(){
	var 
		field = $(this).parent('.field'),
		multi = field.attr('data-multi') === 'true';

	if (!multi) 
	{
		field.find('.option').removeClass('selected');
		$(this).addClass('selected');
	}
	else
	{
		if ($(this).hasClass('selected'))
		{
			$(this).removeClass('selected');
			
			if (!field.find('.selected').length) field.find('.option:contains("any")').addClass('selected');
		}
		else
		{
			if ($(this).text() === 'any')
			{
				field.find('.option').removeClass('selected');
			}
			else
			{
				field.find('.option:contains("any")').removeClass('selected');
			}
			$(this).addClass('selected');
		}
	}
	
});

$(document).on('click', '.toggle-menu, .menu-overlay', App.toggleMenu);

$(document).on('click', '.categories .scroller .item', function(){
	$('.categories .item').removeClass('active');
	$(this).addClass('active');
	
	App.renderResults();
});

$(document).on('click', '.map-categories .scroller .item', function(){
	$('.map-categories .item').removeClass('active');
	$(this).addClass('active');
	
	App.renderLocations();
});

$(document).on('click', '.sign-up .btn-sign-up', function(){
	App.signUp();
});

$(document).on('click', '.sign-in .btn-sign-in', function(){
	App.signIn();
});

$(document).on('click', '.splash .btn-sign-up', function(){
	App.renderSignUp();
});

$(document).on('click', '.sign-in .link-sign-up', function(e){
	e.preventDefault();
	App.renderSignUp();
});

$(document).on('click', '.splash .btn-sign-in', function(){
	App.renderSignIn();
});

$(document).on('click', '.sign-up .link-sign-in', function(e){
	e.preventDefault();
	App.renderSignIn();
});

$(document).on('focus', 'input', function(){
	if ($(this).hasClass('error'))
	{
		$(this).removeClass('error');
		$(this).parent('.input-box').removeClass('error');
	}
});

$(document).on('click', '.menu .nav a', function(e){
	e.preventDefault();
	
	App.toggleMenu();
	
	var 
		method = $(this).attr('data-page'),
		type = $(this).attr('data-type');
	App[method](type);
});

$('#app').scroll(function(){
	var pos = $(this).scrollTop();
	
	if ((pos - App.scrollTop) > 0)
	{
		// scroll down
		$('.create-button').removeClass('grow').addClass('shrink');
	}
	else
	{
		// scroll up
		$('.create-button').removeClass('shrink').addClass('grow');
	}
	
	App.scrollTop = pos;
});

function xhr(o){
	var data = $.extend(o.data, {q: 1});
	
	return $.ajax({
		url: 'api/' + o.data.path,
		data: data,
		type: 'get',
		dataType: (typeof o.dataType === 'undefined') ? 'json' : o.dataType,
		success: (typeof o.success === 'undefined') ? function(){} : o.success,
		error: function(){}
	});
}

function escapeRegExp(str){
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

Math.fmod = function(a, b){
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};

String.prototype.replaceAll = function(find, replace){
	return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

String.prototype.ucFirst = function(){
	var 
		temp = this.split(''),
		first = temp[0].toUpperCase();

	delete temp[0];
	
	return first + temp.join('');
};