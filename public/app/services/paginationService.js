angular.module("paginationService", [])
    .factory("Pagination", function () {
        var paginationFactory = {};
        var data = [];
        var itemsPerPage = 20;
        var currentPage = 0;

        paginationFactory.totalPages = function(){
            return Math.ceil(data.length / itemsPerPage);
        };

        paginationFactory.loadData = function(_data){
            data = _data;
        };

        paginationFactory.getData = function () {
            var start = currentPage * itemsPerPage;
            var end = start + itemsPerPage;
            return data.slice(start, end);
        };

        paginationFactory.moveNext = function () {
            currentPage++;
        };

        return paginationFactory;
    });