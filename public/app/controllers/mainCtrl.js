angular.module('mainCtrl', [])
    .controller('MainController', ['$rootScope', '$location', 'Auth', MainController]);

function MainController($rootScope, $location, Auth) {
    var vm = this;
    this.loggedIn = Auth.isLoggedIn();
    this.loginData = {username: "", password: ""};

    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn()
        Auth.getUser()
            .then(function (data) {
                vm.user = data.data;
            });
    });

    vm.doLogin = function () {
        vm.processing = true;
        vm.error = '';
        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function (data) {
                vm.processing = false;
                Auth.getUser()
                    .then(function (data) {
                        vm.user = data.data;
                    });
                if (data.success) {
                    $location.path('/');
                } else {
                    vm.error = data.message;
                }
            });
    };

    vm.doLogout = function () {
        Auth.logout();
        $location.path('/logout');
    };
}

