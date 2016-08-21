var User = require('../models/user');
var Token = require('../models/token');

module.exports = function(router, isTokenValid) {
	router.post('/signup', function(req, res) {
		var user = new User();
		
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				console.log(err);
				return res.json({
					success: false
				});
			}

			res.json({ 
				success: true
			});
		});
	});

	router.get('/signin', function(req, res) {
		User.findOne({ username: req.query.username }, function(err, user) {
			if(err || !user) {
				return res.json({
					success: false
				});
			}

			// Verify password (for security)
			if(!user.isPasswordValid(req.query.password)) {
				return res.json({
					success: false
				})
			}

			Token.findOne({ user_id: user.id }, function(err, token) {
				if(err) {
					console.log(err);
					return res.json({ 
						success: false
					});
				}

				var newToken = false;
				var genToken = user.getToken(req.query.password);

				// Is the user hasn't any token create one
				if(!token) {
					newToken = true;
				} else if(token.hasExpired()) { // Is it's token has expired remake it
					// Remove the token because of expiration
					token.remove();
					newToken = true;
				}

				// Save the new token
				if(newToken) {
					token = genToken;

					token.save(function(err) {
						if(err) {
							console.log(err);
							return res.json({ 
								success: false
							});
						}
					});
				}

				res.json({ 
					success: true,
					token: token.value,
					username: user.username
				});
			});
		});
	});

	router.delete('/logout', isTokenValid, function(req, res) {
		var accessToken = req.headers['x-access-token'];

		Token.findOne({ value: accessToken }, function(err, token) {
			if(err || !token) {
				res.json({
					success: false
				});
				return next('Token not found');
			}

			token.remove(function(remErr) {
				if(remErr) {
					return res.json({
						success: false
					});
				}

				res.json({
					success: true
				});
			});
		});
	});
}