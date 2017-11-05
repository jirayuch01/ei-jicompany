angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices'])
    .config(function ($httpProvider) {
        console.log('user!');
        $httpProvider.interceptors.push('AuthInterceptors');
    });
