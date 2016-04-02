var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

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
  otherwise({
    redirectTo: '/settings'
  });
}]);
