angular.module("notesCtrl", ['notesService', 'paginatorService'])
    .controller("NotesController", ["Notes","paginatorData", NotesController]);

function NotesController(Notes, paginatorData) {

    var vm = this;
    vm.stringToFind = "";
    vm.params = {};

    vm.findNotes = function(tags){
        if (!tags.trim())
            vm.params.tags = [];
        else
            vm.params.tags = tags.split(' ');
        // set new params to find data
        // it will activate the $watch in the server-paginator controller
        paginatorData.setParams(vm.params);
        vm.stringToFind = tags;
    };

}
