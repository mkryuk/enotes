angular.module('notesService', [])
    .factory("Notes", ['$http', function ($http) {

        var notesFactory = {};
        var apiUri = '/api/notes/';

        notesFactory.getUri = function(){
            return apiUri;
        };

        //POST create note
        notesFactory.create = function (noteData) {
            return $http.post(apiUri, noteData);
        };

        //GET method with tags, offset, limit params
        notesFactory.getNotes = function (params) {
            return $http({
                url:apiUri,
                method: 'GET',
                params: params
            });
        };

        //GET method with params combined in uri
        notesFactory.getNotesByUrl = function (url) {
            return $http({
                url:url,
                method: 'GET'
            });
        };

        //GET note by it's id
        notesFactory.getNote = function (id) {
            return $http.get(apiUri+id);
        };

        //DELETE note by it's id
        notesFactory.deleteNote = function (id) {
            return $http.delete(apiUri + id);
        };

        return notesFactory;
    }]);
