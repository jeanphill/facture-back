var fs = require('fs');
var Token = require('./app/models/token');
var User = require('./app/models/user');

module.exports = function(router) {

	var isTokenValid = function(req, res, next) {
		var accessToken = req.headers['x-access-token'] || req.query.token;

		Token.findOne({ value: accessToken }, function(err, token) {
			if(err || !token) {
				res.json({
					success: false
				});
				return next('Token not found');
			}

			User.findById(token.user_id, function(findErr, user) {
				if(!user) {
					res.json({
						success: false
					});
					return next('User not found');
				} else {
					req.user = user.id;
					req.username = user.username;
					next();
				}
			});
		});
	}

	// dynamically includes routes (Controller)
	fs.readdirSync('./app/controllers').forEach(function (file) {
		if(file.substr(-3) == '.js') {
			require('./app/controllers/' + file)(router, isTokenValid);
		}
	});

	return router;
}
