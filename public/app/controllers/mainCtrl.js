angular.module('mainController', ['authServices'])

	.controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $window) {
		var app = this;
		app.loadme = false;
		$rootScope.$on('$routeChangeStart', function () {
			if (Auth.isLoggedIn()) {
				console.log('Success: user is logged in.');
				app.isLoggedIn = true;
				Auth.getUser().then(function (data) {
					console.log(data.data.username);
					app.username = data.data.username;
					app.useremail = data.data.email;
					app.loadme = true;
				});
			} else {
				console.log('Failure: user is not logged in.');
				app.isLoggedIn = false;
				app.username = '';
				app.loadme = true;
			}
			if ($location.hash() == '_=_') $location.hash(null);
			app.disabled = false;
			app.errorMsg = false;

		});

		this.facebook = function () {
			console.log($window.location);
            console.log($window.location.host);
            console.log($window.location.protocol);
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
		};

		this.twitter = function () {
			console.log($window.location);
            console.log($window.location.host);
            console.log($window.location.protocol);
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
		};

		this.google = function () {
			console.log($window.location);
            console.log($window.location.host);
            console.log($window.location.protocol);
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
		};

		this.doLogin = function (loginData) {
			app.loading = true;
			app.errorMsg = false;
			app.expired = false;
			app.disabled = true;
			Auth.login(app.loginData).then(function (data) {
				if (data.data.success) {
					app.loading = false;
					app.successMsg = data.data.message + '...Redirecting';
					$timeout(function () {
						$location.path('/');
						app.loginData = '';
						app.successMsg = false;
						app.disabled = false;
					}, 2000);
				} else {
					if (data.data.expired) {
						app.expired = true;
						app.loading = false;
						app.errorMsg = data.data.message;
					} else {
						app.loading = false;
						app.disabled = false;
						app.errorMsg = data.data.message;
					}
				}
			});
		};

		this.logout = function () {
			Auth.logout();
			$location.path('/logout');
			$timeout(function () {
				$location.path('/');
			}, 1000);
		};
	});