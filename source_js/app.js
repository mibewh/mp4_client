var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);
// angular.module('mp4', ['720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UsersController'
  }).
  when('/addUser', {
    templateUrl: 'partials/addUser.html',
    controller: 'AddUserController'
  }).
  when('/users/:id', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TasksController'
  }).
  when('/tasks/:id', {
    templateUrl: 'partials/taskInfo.html',
    controller: 'TaskInfoController'
  }).
  when('/editTask/:id', {
    templateUrl: 'partials/editTask.html',
    controller: 'EditTaskController'
  }).
  when('/addTask', {
    templateUrl: 'partials/addTask.html',
    controller: 'AddTaskController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
