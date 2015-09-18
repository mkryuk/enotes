angular.module('mainCtrl', [])
    .controller('MainController', ['$rootScope', '$location', 'Auth', MainController]);

function MainController($rootScope, $location, Auth) {
    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    vm.loginData = {username: "", password: ""};

    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn()
        Auth.getUser()
            .then(function (response) {
                vm.user = response.data;
            });
    });

    vm.doLogin = function () {
        vm.processing = true;
        vm.error = '';
        vm.hasError = false;


        try {

            Auth.login(vm.loginData.username, vm.loginData.password)
                .then(function (response) {//success
                    vm.processing = false;
                    Auth.getUser()
                        .then(function (response) {
                            vm.user = response.data;
                        });
                    $location.path('/');
                }, function (response) {//error
                    vm.error = response.data.message;
                    vm.hasError = true;
                });

        } catch(error){
            console.log("error here");
        }

    };

    vm.doLogout = function () {
        Auth.logout();
        $location.path('/logout');
    };
}

