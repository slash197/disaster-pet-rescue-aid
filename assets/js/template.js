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

	missing:
		'<div class="list">' +
			'list page' +
		'</div>'
};

export default PageTemplate;