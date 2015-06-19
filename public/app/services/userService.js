angular.module('userService', [])
    .factory('User', function ($http) {
        //Interface
        var userFactory = {
            create: create,
            all:all
        };
        return userFactory;

        //Realization
        function create (userData) {
            return $http.post('/api/signup', userData);
        }

        function all () {
            return $http.get('api/users');
        }
    });