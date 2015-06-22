(function () {
    angular.module('paginatorService', [])
        .factory('paginatorData', ['$http', PaginatorData]);

    function PaginatorData($http) {

        //exposed functions
        var factory = {
            setParams: setParams,
            loadData: loadData,
            totalPages: totalPages,
            canNavigate: canNavigate,
            moveFirst: moveFirst,
            moveLast: moveLast,
            moveNext: moveNext,
            movePrev: movePrev,
            getPageByNum: getPageByNum,
            pages: pages,
            getActivePage: getActivePage
        };

        //private params
        var totalItems = 0,
            activePage = 0,
            visiblePageCount = 5,
            dataLoaded = false,
            from = 0,
            to = from + visiblePageCount,
            _uri = "",
            _params = {
                offset: 0,
                limit: 20
            };


        return factory;
        ///////////////////////

        function setParams(uri, params) {
            _uri = uri;
            _params = params;
            dataLoaded = false;
        }

        function canNavigate() {
            return dataLoaded;
        }

        function pages() {
            if (!dataLoaded) return [];
            var pages = [];
            //if (to) is at it's end and active page is > than middle (from) should be vm. totalPages - visiblePageCount
            if (to == totalPages() && factory.activePage >= totalPages() - Math.floor(visiblePageCount / 2)) {
                from = totalPages() - visiblePageCount >= 0 ? totalPages() - visiblePageCount : 0;
            } else {
                from = activePage - Math.floor(visiblePageCount / 2) <= 0 ? 0 : activePage - Math.floor(visiblePageCount / 2);
            }
            to = from + visiblePageCount <= totalPages() - 1 ? from + visiblePageCount : totalPages();
            for (var i = from; i < to; i++) {
                pages.push(i);
            }
            return pages;
        }

        //GET data from uri with params
        function loadData() {
            dataLoaded = false;
            return $http({
                url: _uri,
                method: 'GET',
                params: _params
            })
                .success(loadDataComplete);
        }

        function loadDataComplete(data, status, headers, config) {
            totalItems = headers('X-Total-Count');
            dataLoaded = true;
            return data;
        }

        //function setParams(params){
        //    factory.params = params;
        //}

        function totalPages() {
            if (!dataLoaded) return 0;
            //console.log(totalItems);
            return Math.ceil(totalItems / _params.limit);
        }

        function moveFirst() {
            if (!dataLoaded || activePage <= 0) return false;
            return setActivePage(0);
        }

        function moveLast() {
            if (!dataLoaded || activePage >= (totalPages() - 1)) return false;
            return setActivePage(totalPages() - 1);
        }

        function moveNext() {
            if (!dataLoaded || activePage >= (totalPages() - 1)) return false;
            return setActivePage(activePage + 1);
        }

        function movePrev() {
            if (!dataLoaded || activePage <= 0) return false;
            return setActivePage(activePage - 1);
        }

        function getPageByNum(page) {
            if (!dataLoaded || page >= totalPages() || page < 0) return false;
            return setActivePage(page);
        }

        function setActivePage(page) {
            //if (page == null) return false;
            //if (page < 0) return false;
            //if (page > totalPages() - 1) return false;
            activePage = page;
            _params.offset = parseInt(page) * _params.limit;
            return true;
        }

        function getActivePage(){
            if (!dataLoaded) return -1;
            return activePage;
        }
    }

})();

