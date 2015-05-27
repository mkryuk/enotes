angular.module('storyCtrl', ['storyService'])
    .controller('StoryController', ['Story', 'Socketio', StoryController])
    .controller('AllStoriesController', ['stories', 'Socketio', AllStoriesController]);

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

    Socketio.on('story', function (data) {
        vm.stories.push(data);
    });
}

function AllStoriesController(stories, Socketio) {
    var vm = this;
    vm.stories = stories.data;
    Socketio.on('story', function (data) {
        vm.stories.push(data);
    });
}

