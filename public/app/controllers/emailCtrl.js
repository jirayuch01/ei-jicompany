angular.module('emailController', ['userServices'])
    .controller('emailCtrl', function ($routeParams, User, $timeout, $location) {
        console.log($routeParams.token);
        // app = this;
        User.activateAccount($routeParams.token).then(function (data) {
        //     app.errorMsg = false; 
        //     if (data.data.success) {
        //         app.successMsg = data.data.message + '...Redirecting'; 
        //         $timeout(function () {
        //             $location.path('/login');
        //         }, 2000);
        //     } else {
        //         app.errorMsg = data.data.message + '...Redirecting'; 
        //         $timeout(function () {
        //             $location.path('/login');
        //         }, 2000);
        //     }
        });
    });