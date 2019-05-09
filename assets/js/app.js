/*
 * © 2019 SlashWebDesign
 */
import PageTemplate from './template.js';

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
		color: 'any',
		gender: 'any',
		hair: 'any'
	};
	this.page = 'missing';
	this.user = {
		id: null,
		token: null
	};
	this.scrollTop = 0;
	
	this.signIn = function(){
		if (!this.validate(['email', 'password'])) return false;
		
		xhr({
			data: {
				path: 'login',
				email: $('input[name="email"]').val(),
				password: $('input[name="password"]').val()
			},
			success: function(r){
				this.user = {
					id: r.id,
					token: r.token
				};
				this.renderMissing();
				
				window.localStorage.setItem('dpra.user', JSON.stringify(this.user));
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
				window.localStorage.setItem('dpra.user', r.token);
				this.renderMissing();
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
			r = Math.floor(index / 3) + 1;

		$(
			'<section class="preview">' +
				'<div class="name">' + item.name + '</div>' +
				'<div class="props">' + breed + ', ' + item.color + '</div>' +
				'<div class="date">Reported on ' + date.format('MMMM D, YYYY') + '</div>' +
				'<button class="btn btn-small btn-white btn-view">view</button>' +
			'</section>'
		).insertAfter('.results .item:eq(' + (r * 3 - 1) + ')');
	};
	
	this.hidePreview = function(){
		$('.results .preview').remove();
	};
	
	this.buildColorFilterString = function(){
		var 
			str = '',
			temp = App.filters.color.split('|');
		
		for (var i = 0; i < temp.length; i++)
		{
			if (i !== 0) str += ' OR ';
			str += 'color LIKE "%' + temp[i] + '%"';
		}
		
		return str;
	};
	
	this.buildFilterString = function(){
		var str = '';
		
		if (App.filters.disaster_id !== '0') str += ' AND disaster_id = ' + App.filters.disaster_id;
		if (App.filters.breed_id !== '0') str += ' AND breed_id = ' + App.filters.breed_id;
		if (App.filters.color !== 'any') str += ' AND (' + App.buildColorFilterString() + ')';
		if (App.filters.gender !== 'any') str += ' AND gender = "' + App.filters.gender + '"';
		if (App.filters.hair !== 'any') str += ' AND hair = "' + App.filters.hair + '"';
		
		return str;
	};
	
	this.updateFilterLabel = function(){
		var label = '';
		
		if (App.filters.breed_id !== '0') label += this.getBreed(App.filters.breed_id) + '; ';
		if (App.filters.color !== 'any') label += App.filters.color.replaceAll('|', ', ') + ' color; ';
		if (App.filters.hair !== 'any') label += App.filters.hair + ' hair; ';
		if (App.filters.gender !== 'any') label += App.filters.gender + ';';
		
		if (label === '') label = 'no filters';
		
		$('.btn-filter .selection').html(label);
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
				fields: 'report_id, name, description, breed_id, disaster_id, color, gender, hair, microchip, altered, files, date',
				filter: 'status = "approved" AND category_id = ' + this.category_id + this.buildFilterString(),
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
							'<img src="upload/' + item.files[0] + '" />' +
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
	
	this.renderCategories = function(){
		var 
			html = '',
			c = null;
	
		for (var i = 0; i < this.categories.length; i++)
		{
			c = this.categories[i];
			html += '<div class="item" data-id="' + c.category_id + '">' + c.name + '</div>';
		}
		
		$('.categories').html('<div class="scroller">' + html + '</div>');
		$('.categories .scroller .item:first-child').trigger('click');
	};
	
	this.renderMissing = function(){
		this.fadeScreen(function(){
			$('html').removeClass('bg-gradient');
			$('#app').html(PageTemplate.missing);
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
		
		$('[data-tag="color"]').append(html);
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
			$('.menu-overlay').show().animate({opacity: 1}, 300);
			$('.menu').animate({left: 0}, 300);
		}
		else
		{
			$('.menu-overlay').hide().css({opacity: 0});
			$('.menu').animate({left: -245}, 100);
		}
	};
	
	this.toggleFilters = function(){
		if (Math.round($('.filter').position().top) !== 0)
		{
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
			$('.create').scrollTop(0);
			$('.create h1').html('Create ' + App.page + ' pet report');
			$('.create input, .create textarea').val('');
			$('.create [data-tag="files"] span').remove();
			$('.create').animate({top: 0}, 300);
		}
		else
		{
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
			field = $('.' + selector + ' .field[data-tag="' + tag + '"');
		
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
		loadStyle('https://fonts.googleapis.com/css?family=Roboto:300,400,500', function(){
			document.querySelector('.splash h1').style.display = 'block';
		}, true);
		loadStyle('assets/css/bootstrap.css', null, true);
		loadStyle('assets/css/fileuploader.css', null, true);
		loadStyle('assets/css/font-style.css', null, true);

		loadScript('assets/js/jquery.min.js', function(){
			loadScript('assets/js/bootstrap.min.js', function(){
				loadScript('assets/js/datepicker.min.js', function(){
					loadScript('assets/js/fileuploader.js', function(){
						loadScript('assets/js/moment.js', function(){
							loadScript('assets/js/uploader.js', function(){
								xhr({
									data: {
										path: 'disaster/get',
										fields: 'disaster_id, name',
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
							}, true);
						}, true);
					}, true);
				}, true);
			}, true);
		}, true);
	};
	
	this.afterLoaded = function(){
		// all resources are loaded
		$('.splash .spinner-holder').remove();
		$('.menu, .create, .notify, .filter').show();
		
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

		var temp = JSON.parse(window.localStorage.getItem('dpra.user') || null);

		if (!temp)
		{
			$('.splash').append(
				'<p><button class="btn btn-white btn-sign-up">sign up</button></p>' +
				'<p><button class="btn btn-blue btn-sign-in">sign in</button></p>'
			);
		}
		else
		{
			this.user = temp;
			this.renderMissing();
		}
	};
	
	this.init = function(){
		$('#app').html(
			'<div class="splash">' +
				'<div><img src="assets/image/logo.big.white.png" /></div>' +
				'<h1><span>disaster</span><span>pet rescue</span><span>aid</span></h1>' +
				'<div class="spinner-holder"><div class="spinner s60 white"></div></div>' +
			'</div>'
		);
		
		this.fetchResources();
	};
	
	this.init();
};

var App = new DPRA();

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
		disaster_id: App.option2param('disaster', 'filter'),
		breed_id: App.option2param('breed', 'filter'),
		color: App.option2param('color', 'filter'),
		gender: App.option2param('gender', 'filter'),
		hair: App.option2param('hair', 'filter')
	};
	
	App.updateFilterLabel();
	
	$('.categories .item[data-id="' + App.category_id + '"]').trigger('click');	
});

$(document).on('click', '.create-button', App.toggleForm);

$(document).on('click', '.create .btn-cancel', App.toggleForm);

$(document).on('click', '.create .btn-create', function(){
	if (!App.validate(['files', 'name', 'description', 'color'])) return false;

	xhr({
		data: {
			path: 'report/create',
			data: {
				name: $('[name="name"]').val(),
				breed: $('[name="breed"]').val(),
				color: App.option2param('color', 'create'),
				files: App.option2param('files', 'create'),
				description: $('[name="description"]').val(),
				microchip: $('[name="microchip"]').val(),
				hair: App.option2param('hair', 'create'),
				gender: App.option2param('gender', 'create'),
				altered: App.option2param('altered', 'create'),
				date: moment().unix(),
				member_id: App.user.id,
				category_id: App.category_id,
				disaster_id: App.option2param('disaster', 'create'),
				breed_id: App.option2param('breed', 'create'),
				status: 'pending',
				type: App.page
			}
		},
		success: function(r){
			App.toggleForm();
			App.notify('Your report has been sent and is pending approval');
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
		type: 'post',
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