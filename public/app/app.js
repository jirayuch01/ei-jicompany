angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController'])
	.config(function ($httpProvider) {
		console.log('user!');
		$httpProvider.interceptors.push('AuthInterceptors');
	});