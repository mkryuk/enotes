(function () {
    angular.module('paginatorService', [])
        .factory('paginatorData', ['$http', PaginatorData]);

    function PaginatorData($http) {

        //exposed functions
        var factory = {
            setUri: setUri,
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
        //special $watch variable for directive controller
        //to notify it that data has been changed
        factory.shouldUpdate = false;

        //private params
        var totalItems = 0,
            activePage = 0,
            visiblePageCount = 5,
            dataLoaded = false,
            from = 0,
            to = visiblePageCount,
            _uri = "",
            _params = {
                offset: 0,
                limit: 20
            };


        return factory;
        ///////////////////////

        function setUri(uri) {
            _uri = uri;
            dataLoaded = false;
            //factory.shouldUpdate = true;
        }

        function setParams(params) {
            //save the limit
            var limit = params.limit || _params.limit;
            _params = params;
            //restore limit data and set offset to 0
            setActivePage(0);
            _params.limit = limit;
            dataLoaded = false;
            factory.shouldUpdate = true;
            //TODO maybe should change dataLoaded var to factory.shouldUpdate for watching when to reload the data
        }

        function canNavigate() {
            return dataLoaded;
        }

        function pages() {
            if (!dataLoaded) return [];
            var pages = [];
            var pagesFromCenter = Math.floor(visiblePageCount / 2);

            //if we just start to navigate
            if (activePage - pagesFromCenter <= 0) {
                from = 0;
            }
            //if we reach the end of pages we should not move the first
            // otherwise it will be less than visiblePageCount items visible
            else if (totalPages() - (activePage - pagesFromCenter) < visiblePageCount)
            {
                from = totalPages() - visiblePageCount;
            }
            //if we didn't reach the start or end of pages continue to move (from) value
            else {
                from = activePage - pagesFromCenter;
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

        function getActivePage() {
            if (!dataLoaded) return -1;
            return activePage;
        }
    }

})();

