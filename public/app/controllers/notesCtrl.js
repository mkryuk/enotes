angular.module("notesCtrl", ['notesService'])
    .controller("NotesController", ["Notes", NotesController]);

function NotesController(Notes) {

    var vm = this;
    vm.notes = [];
    vm.params = {
        offset: 0,
        limit: 2,
        tags: []
    };
    vm.links = {};
    vm.stringToFind = "";
    var totalItems = 0;
    vm.activePage = 0;
    var visiblePageCount = 5;
    var from = 0;
    var to = from + visiblePageCount;

    vm.pages = function () {
        var pages = [];
        //if (to) is at it's end and active page is > than middle (from) should be vm. totalPages - visiblePageCount
        if (to == vm.totalPages() && vm.activePage >= vm.totalPages() - Math.floor(visiblePageCount / 2)) {
            from = vm.totalPages() - visiblePageCount >= 0 ? vm.totalPages() - visiblePageCount : 0;

        } else {
            from = vm.activePage - Math.floor(visiblePageCount / 2) <= 0 ? 0 : vm.activePage - Math.floor(visiblePageCount / 2);
        }
        to = from + visiblePageCount <= vm.totalPages() - 1 ? from + visiblePageCount : vm.totalPages();
        for (var i = from; i < to; i++) {
            pages.push(i);
        }
        return pages;
    };

    vm.totalPages = function () {
        return Math.ceil(totalItems / vm.params.limit)
    };

    Notes.getNotes(vm.params)
        .success(function (data, status, headers, config) {
            vm.notes = data.notes;
            //api links for navigation back forward across the notes
            vm.links = data.links;
            totalItems = headers('X-Total-Count');
        });

    function fillTags() {
        //if vm.stringToFind is empty
        if (!vm.stringToFind.trim())
            vm.params.tags = [];
        else
            vm.params.tags = vm.stringToFind.split(' ');
    }

    vm.findNotes = function () {
        setActivePage(0);
        fillTags();
        loadData();
    };

    function loadData() {
        Notes.getNotes(vm.params)
            .success(function (data, status, headers, config) {
                vm.notes = data.notes;
                //api links for navigation back forward across the notes
                vm.links = data.links;
                totalItems = headers('X-Total-Count');
            });
    }

    vm.moveFirst = function () {
        if (vm.activePage == 0) return;
        setActivePage(0);
    };

    vm.moveLast = function () {
        if (vm.activePage == (vm.totalPages() - 1)) return;
        setActivePage(vm.totalPages() - 1);
    };

    vm.moveNext = function () {
        if (vm.activePage == (vm.totalPages() - 1)) return;
        setActivePage(vm.activePage + 1);
    };

    vm.movePrev = function () {
        if (vm.activePage == 0) return;
        setActivePage(vm.activePage - 1);
    };

    vm.getPageByNum = function (page) {
        if (page >= vm.totalPages() || page < 0) return;
        setActivePage(page);
    };

    function setActivePage(page) {
        if (page == null) return;
        if (page < 0) return;
        if (page > vm.totalPages() - 1) return;
        vm.activePage = page;
        vm.params.offset = parseInt(page) * vm.params.limit;
        loadData();
    }
}
