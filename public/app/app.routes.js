angular.module('appRoutes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/login', {
                templateUrl: 'app/views/pages/login.html'
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/home.html'
            })
            .when('/signup', {
                templateUrl: 'app/views/pages/signup.html'
            })
            .when('/notes', {
                templateUrl: 'app/views/pages/notes.html'
            })
            .when('/allstories', {
                templateUrl: 'app/views/pages/allStories.html',
                controller: 'AllStoriesController',
                controllerAs: 'story',
                resolve: {
                    stories: function (Story) {
                        return Story.allStories();
                    }
                }
            })
            .otherwise({templateUrl: 'app/views/pages/404.html'});


        $locationProvider.html5Mode(true);
    });