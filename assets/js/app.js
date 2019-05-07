/*
 * © 2019 SlashWebDesign
 */
import PageTemplate from './template.js';

var DPRA = function(){
	
	this.categories = [];
	
	this.signIn = function(){
		if (!this.validate(['email', 'password'])) return false;
		
		xhr({
			data: {
				path: 'login',
				email: $('input[name="email"]').val(),
				password: $('input[name="password"]').val()
			},
			success: function(r){
				window.localStorage.setItem('dpra.user', r.token);
				this.renderMissing();
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
	
	this.renderResults = function(){
		$('.results').html('<div class="spinner-holder"><div class="spinner s60 blue"></div></div>');
		
		xhr({
			data: {
				path: 'report/get',
				fields: '*',
				filter: 'category_id = ' + $('.categories .item.active').attr('data-id'),
				order: 'date DESC'
			},
			success: function(r){
				$('.spinner-holder').remove();
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
	
	this.toggleMenu = function(){
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
	
	this.validate = function(form){
		for (var i = 0; i < form.length; i++)
		{
			if ($('input[name="' + form[i] + '"]').val() === '')
			{
				lg('error');
				$('input[name="' + form[i] + '"]').addClass('error');
				$('input[name="' + form[i] + '"]').parent('.input-box').addClass('error');
				return false;
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
							xhr({
								data: {
									path: 'category/get',
									fields: 'category_id, name, sort_order',
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
	};
	
	this.afterLoaded = function(){
		// all resources are loaded
		$('.splash .spinner-holder').remove();
		$('.menu').show();

		var user = window.localStorage.getItem('dpra.user') || null;

		if (!user)
		{
			$('.splash').append(
				'<p><button class="btn btn-white btn-sign-up">sign up</button></p>' +
				'<p><button class="btn btn-blue btn-sign-in">sign in</button></p>'
			);
		}
		else
		{
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
