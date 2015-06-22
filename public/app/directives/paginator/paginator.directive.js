(function () {
    angular.module('ServerPaginator', ['paginatorService'])
        .directive('serverPaginator', ['paginatorData', serverPaginator]);

    function serverPaginator(paginatorData) {
        var directive = {
            scope: {data:'=serverData'},
            restrict: 'E',
            transclude:true,
            templateUrl: "/app/directives/paginator/paginator.tmpl.html",
            link: link
        };
        return directive;
        //////////////////

        function link(scope, element, attrs, controller) {
            var uri = attrs.uri;
            var params = {
                limit: attrs.limit || 20
            };
            scope.data = {};
            scope.paginatorData = paginatorData;
            scope.canNavigate = scope.paginatorData.canNavigate;

            scope.pages = [];
            scope.paginatorData.setUri(uri);
            scope.paginatorData.setParams(params);//activate() called here because of $watch

            //load the initial data
            //activate();
            function activate() {
                return loadData()
                    .then(function (data) {
                        //console.log('data loaded');
                    });
            }

            function loadData() {
                return paginatorData.loadData()
                    .then(updateData);
            }

            function updateData(data) {
                scope.data = data;
                scope.pages = scope.paginatorData.pages();
                scope.canNavigate = scope.paginatorData.canNavigate;
            }

            scope.$watch('paginatorData.shouldUpdate', function(){
                if(scope.paginatorData.shouldUpdate)
                {
                    //reload the data
                    activate();
                    scope.paginatorData.shouldUpdate = false;
                }
            });

            ///end load data config///

            scope.moveNext = function () {
                if (scope.paginatorData.moveNext())
                    loadData();
            };

            scope.movePrev = function () {
                if (scope.paginatorData.movePrev())
                    loadData();
            };

            scope.moveFirst = function () {
                if (scope.paginatorData.moveFirst())
                    loadData();
            };

            scope.moveLast = function () {
                if (scope.paginatorData.moveLast())
                    loadData();
            };

            scope.getPage = function (page) {
                if (scope.paginatorData.getPageByNum(page))
                    loadData();
            };

            scope.getActivePage = function () {
                return scope.paginatorData.getActivePage();
            };
        }
    }
})();


