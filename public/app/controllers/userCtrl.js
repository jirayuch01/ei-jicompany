angular.module('userControllers', ['userServices'])
    .controller('regCtrl', function ($http, $location, $timeout, User) {
        var app = this;
        this.regUser = function (regData) {
            console.log('new user');
            console.log(this.regData);
            app.loading = true;
            app.errorMsg = false;
            User.create(app.regData).then(function (data) {
                console.log(data);
                console.log(data.data.success);
                console.log(data.data.message);
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';
                    $timeout(function () {
                        $location.path('/');
                    }, 2000);
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
    })

    .controller('facebookCtrl', function ($routeParams, Auth, $location, $window) {
        var app = this;
        app.errorMsg = false;
        if ($window.location.pathname == '/facebookerror') {
            app.errorMsg = 'Facebook e-mail not found in database.';
        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })

    .controller('twitterCtrl', function ($routeParams, Auth, $location, $window) {
        var app = this;
        app.errorMsg = false;
        if ($window.location.pathname == '/twittererror') {
            app.errorMsg = 'Twitter e-mail not found in database.';
        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })

    .controller('googleCtrl', function ($routeParams, Auth, $location, $window) {
        var app = this;
        app.errorMsg = false;
        if ($window.location.pathname == '/googleerror') {
            app.errorMsg = 'Google e-mail not found in database.';
        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    });

