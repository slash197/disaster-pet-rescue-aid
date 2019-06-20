var PageTemplate = {
	signUp: 
		'<div class="sign-up">' +
			'<div class="logo"><img src="assets/image/logo.big.white.png" /></div>' +
			'<div class="row"><div class="input-box"><span class="ico ico-email"></span><input type="text" name="email" placeholder="Email address" /></div></div>' +
			'<div class="row"><div class="input-box"><span class="ico ico-lock-outline"></span><input type="password" name="password" placeholder="Password" /></div></div>' +
			'<div class="row"><div class="input-box"><span class="ico ico-lock-outline"></span><input type="password" name="cpass" placeholder="Confirm password" /></div></div>' +
			'<p class="btn-holder"><button class="btn btn-sign-up btn-blue">sign up</button></p>' +
			'<p>Already have an account?</p>' +
			'<p><a href="#" class="link-sign-in">Sign in</a></p>' +
		'</div>',

	signIn:
		'<div class="sign-in">' +
			'<div class="logo"><img src="assets/image/logo.big.white.png" /></div>' +
			'<div class="row"><div class="input-box"><span class="ico ico-email"></span><input type="text" name="email" placeholder="Email address" /></div></div>' +
			'<div class="row"><div class="input-box"><span class="ico ico-lock-outline"></span><input type="password" name="password" placeholder="Password" /></div></div>' +
			'<p class="btn-holder"><button class="btn btn-sign-in btn-blue">sign in</button></p>' +
			'<p>Don\'t have an account yet?</p>' +
			'<p><a href="#" class="link-sign-up">Sign up</a></p>' +
		'</div>',

	about:
		'<div class="about">' +
			'<div class="header">' +
				'<span class="ico ico-menu toggle-menu"></span><span class="title">About us</span><img src="assets/image/menu.png" />' +
			'</div>' +
			'<div class="content">' +
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' +
			'</div>' +
		'</div>',

	home: 
		'<div class="home">' +
			'<div class="header">' +
				'<span class="title">Disaster Pet Rescue AID</span><img src="assets/image/menu.png" />' +
			'</div>' +
			'<div class="hero"><img src="assets/image/home.jpeg" /></div>' +
			'<div class="content">' +
				'<h1>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h1>' +
				'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
				'<div class="location-disclaimer">DPRA needs your location in order to log the most recent sighting in it\'s appropriate place, as well as for populating the information map</div>' +
			'</div>' +
			'<div class="action">' +
				'<a href="#" class="btn btn-white btn-donate">Donate</a>' +
				'<a href="select-disaster" class="btn btn-blue btn-continue">Continue</a>' +
			'</div>' +
		'</div>',

	disasters: 
		'<div class="home">' +
			'<div class="header">' +
				'<span class="title">Disaster Pet Rescue AID</span><img src="assets/image/menu.png" />' +
			'</div>' +
			'<div class="tab shadow">' + 
				'<div data-type="recent" class="active">Recent</div>' +
				'<div data-type="past">Past</div>' +
			'</div>' +
			'<div class="disasters"></div>' +
		'</div>',

	reports:
		'<div class="reports">' +
			'<div class="shadow">' +
				'<div class="header">' +
					'<span class="ico ico-menu toggle-menu"></span><span class="title">My reports</span><img src="assets/image/menu.png" />' +
				'</div>' +
			'</div>' +
			'<div class="items"></div>' +
		'</div>',

	map:
		'<div class="map">' +
			'<div class="header">' +
				'<span class="ico ico-menu toggle-menu"></span><span class="title">Locations</span><img src="assets/image/menu.png" />' +
			'</div>' +
			'<div class="shadow">' +
				'<div class="map-categories"></div>' +
			'</div>' +
			'<div class="map-holder">' +
				'<div id="map" class="results"></div>' +
				'<div class="map-popup-overlay"></div>' + 
				'<div class="map-popup shrink">' + 
					'<div class="image"></div>' +
					'<div class="props">' + 
						'<div class="breed"><label>breed</label><span></span></div>' +
						'<div class="gender"><label>gender</label><span></span></div>' +
						'<div class="color"><label>color</label><span></span></div>' +
						'<div class="hair"><label>hair</label><span></span></div>' +
					'</div>' +
					'<div class="location"></div>' +
				'</div>' +
			'</div>' +
		'<div>',

	list:
		'<div class="list">' +
			'<div class="header">' +
				'<span class="ico ico-menu toggle-menu"></span><span class="title"></span><img src="assets/image/menu.png" />' +
				'<div class="stat"><span class="value"></span> pets helped to date</div>' +
			'</div>' +
			'<div class="shadow">' +
				'<div class="btn-filter">' +
					'<span class="ico ico-search"></span><span class="selection">Filters</span>' +
				'</div>' +
				'<div class="categories"></div>' +
			'</div>' +
			'<div class="results"></div>' +
		'</div>' +
		'<div class="create-button"><span class="ico ico-add"></span></div>'
};

var MapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

export var PageTemplate;
export var MapStyle;