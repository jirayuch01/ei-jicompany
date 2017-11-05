angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope) {
        var app = this;
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                console.log('Success: user is logged in.');
                Auth.getUser().then(function (data) {
                    console.log(data.data.username);
                    app.username = data.data.username;
                });
            } else {
                console.log('Failure: user is not logged in.');
            }
        });
        this.doLogin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;
            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';
                    $timeout(function () {
                        $location.path('/about');
                    }, 2000);
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
        this.logout = function () {
            Auth.logout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
            }, 2000);
        };
    });
