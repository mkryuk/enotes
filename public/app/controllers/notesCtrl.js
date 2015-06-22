angular.module("notesCtrl", ['notesService', 'paginatorService'])
    .controller("NotesController", ["Notes","paginatorData", NotesController]);

function NotesController(Notes, paginatorData) {

    var vm = this;
    vm.someFung = function(){
        console.log("testFunc");
        test();
    };
    //vm.data = paginatorData.data;
    //console.log(vm.data);
    //
    //vm.loadData = loadData;
    //
    //function loadData() {
    //    console.log("data");
    //    return paginatorData.loadData()
    //        .then(updateData);
    //}
    //
    //function updateData(data) {
    //    vm.data = data;
    //    console.log(vm.data);
    //}

}
