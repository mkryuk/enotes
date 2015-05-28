angular.module('storyCtrl', ['storyService'])
    .controller('StoryController', ['Story', 'Socketio', StoryController])
    .controller('AllStoriesController', ['Story', 'Socketio', AllStoriesController]);

function StoryController(Story, Socketio) {
    vm = this;
    vm.storyData = '';
    vm.stories = [];
    Story.getStories()
        .success(function (data) {
            vm.stories = data;
        });

    vm.createStory = function () {
        Story.create(vm.storyData)
            .success(function (data) {
                vm.storyData = '';
                vm.message = data.message;
            });
    };

    vm.deleteStory = function (id) {
        Story.delete(id)
            .success(function (data) {
                vm.message = data.message;
            })
    };

    Socketio.on('story', function (data) {
        vm.stories.push(data);
    });

    Socketio.on('story_deleted', function (id) {
        vm.stories.forEach(function (elem, index, array) {
            if (elem._id == id) {
                array.splice(index, 1);
            }
        });
    });
}

function AllStoriesController(Story, Socketio) {
    var vm = this;
    vm.stories = [];
    Story.allStories()
        .success(function (data) {
            vm.stories = data;
        });

    Socketio.on('story', function (data) {
        vm.stories.push(data);
    });
}

