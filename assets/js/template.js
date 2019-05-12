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

	map:
		'<div class="map">' +
			'<div class="header">' +
				'<img src="assets/image/menu.png" class="toggle-menu" />Locations' +
			'</div>' +
			'<div class="shadow">' +
				'<div class="map-categories"></div>' +
			'</div>' +
			'<div id="map" class="results"></div>' +
			'<div class="map-popup">' + 
				'<div class="image"></div>' +
				'<div class="props">' + 
					'<div class="breed"><label>breed</label><span></span></div>' +
					'<div class="gender"><label>gender</label><span></span></div>' +
					'<div class="color"><label>color</label><span></span></div>' +
					'<div class="hair"><label>hair</label><span></span></div>' +
				'</div>' +
				'<div class="location"></div>' +
			'</div>' +
		'<div>',

	missing:
		'<div class="list">' +
			'<div class="header">' +
				'<img src="assets/image/menu.png" class="toggle-menu" />Missing' +
			'</div>' +
			'<div class="shadow">' +
				'<div class="btn-filter">' +
					'<span class="ico ico-filter-list"></span><span class="selection">no filters</span>' +
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