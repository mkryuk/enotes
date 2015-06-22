var app = angular.module('MyApp',[
    'appRoutes',
    'mainCtrl',
    'authService',
    'userCtrl',
    'userService',
    'storyService',
    'storyCtrl',
    'notesCtrl',
    'reverseDirective',
    'paginatorService',
    'ServerPaginator'
])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });