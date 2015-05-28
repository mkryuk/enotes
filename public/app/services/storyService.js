angular.module('storyService', [])
    .factory('Story', function ($http) {
        var storyFactory = {};

        storyFactory.create = function (storyData) {
            return $http.post('/api/stories/', storyData);
        };

        storyFactory.getStories = function () {
            return $http.get('/api/stories/');
        };

        storyFactory.allStories = function () {
            return $http.get('/api/all_stories/');
        };

        storyFactory.delete = function (storyId) {
            return $http.delete('/api/stories/' + storyId);
        };

        return storyFactory;
    })
    .factory('Socketio', function ($rootScope) {
        var socket = io.connect();
        return {

            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },

            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }

        };
    });

