angular.module('userCtrl', ['userService'])
    //.controller('UserController', ['User', UserController])
    .controller('UserCreateController', ['User', '$location', '$window', UserCreateController]);

//function UserController(User)
//{
//    var vm = this;
//    //User.all()
//    //    .success(function (data) {
//    //        vm.users = data;
//    //    });
//}

function UserCreateController(User, $location, $window) {
    var vm = this;
    vm.signupUser = function () {
        vm.message = '';
        User.create(vm.userData)
            .then(function (response) {
                vm.userData = {};
                vm.message = response.data.message;
                $window.localStorage.setItem('token', response.data.token);
                $location.path('/');
            });
    };
}