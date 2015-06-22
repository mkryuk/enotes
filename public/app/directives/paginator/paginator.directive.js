(function () {
    angular.module('ServerPaginator', ['paginatorService'])
        .directive('serverPaginator', ['paginatorData', serverPaginator]);

    function serverPaginator(paginatorData) {
        var directive = {
            scope: {data:'=serverData', test:'&testme'},
            restrict: 'E',
            transclude:true,
            templateUrl: "/app/directives/paginator/paginator.tmpl.html",
            link: link
        };
        return directive;
        //////////////////

        function link(scope, element, attrs, controller) {
            console.log(controller);
            var uri = attrs.uri;
            var params = {
                limit: attrs.limit || 20,
            };
            paginatorData.setParams(uri, params);
            scope.data = {};
            scope.canNavigate = paginatorData.canNavigate;
            scope.pages = [];
            //load the initial data
            activate();
            function activate() {
                return loadData()
                    .then(function (data) {
                        console.log('data loaded');
                    });
            }

            function loadData() {
                return paginatorData.loadData()
                    .then(updateData);
            }

            function updateData(data) {
                scope.data = data;
                scope.pages = paginatorData.pages();
                scope.canNavigate = paginatorData.canNavigate;
            }

            ///end load data config///

            scope.moveNext = function () {
                if (paginatorData.moveNext())
                    loadData();
            };

            scope.test = function(){
                console.log("this is a test function");
            };

            scope.movePrev = function () {
                if (paginatorData.movePrev())
                    loadData();
            };

            scope.moveFirst = function () {
                if (paginatorData.moveFirst())
                    loadData();
            };

            scope.moveLast = function () {
                if (paginatorData.moveLast())
                    loadData();
            };

            scope.getPage = function (page) {
                if (paginatorData.getPageByNum(page))
                    loadData();
            };

            scope.getActivePage = function () {
                return paginatorData.getActivePage();
            };
        }
    }
})();


