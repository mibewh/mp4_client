var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
    $scope.show = true;
  };

}]);

mp4Controllers.controller('UsersController', ['$scope', 'Users', function($scope, Users) {
    //Get the user data
    Users.get().success(function(data) {
      $scope.users = data.data;
    });
    //Handle deletes
    $scope.delete = function(user) {
      Users.delete(user._id).success(function(data) {
        //Remove from list
        var index = $scope.users.indexOf(user);
        $scope.users.splice(index, 1);
      });
    }
}]);

mp4Controllers.controller('AddUserController', ['$scope', 'Users', function($scope, Users) {
    $(document).foundation(); //The fact that I have to do this is really dumb. Needed so callouts work
    $scope.user = {};
    $scope.submit = function() {
      //Hide callouts
      $scope.fail = false;
      $scope.success = false;
      //Perform post and check response
      Users.post($scope.user)
      .success(function(data) {
        $scope.success = true;
      })
      .error(function(error) {
        $scope.fail = true;
        $scope.error = error.message;
      });
    }
}]);

mp4Controllers.controller('ProfileController', ['$scope', '$routeParams', 'Users', function($scope, $routeParams, Users) {
  //Fetch the user
  Users.getUser($routeParams.id).success(function(data) {
    $scope.user = data.data;
  });

}]);

mp4Controllers.controller('TasksController', ['$scope', 'Tasks', function($scope, Tasks) {
  $scope.order = false;
  $scope.subset= 'pending';
  $scope.page = 0;
  $scope.orderType='dateCreated'
  //Update the shown tasks
  function reload() {
    Tasks.get($scope.orderType, $scope.order, $scope.page, $scope.subset).success(function(data) {
      $scope.tasks = data.data;
    });
    Tasks.getCount($scope.subset).success(function(data) {
      $scope.pages = Math.floor(data.data / 10);
    });
  }
  $scope.update = function() {
    $scope.page = 0;
    reload();
  };
  $scope.changePage = function(newPage) {
    $scope.page = newPage;
    reload();
  }
  $scope.getDate = function(date) {
    var d = new Date(date);
    return d.toLocaleDateString("en-us")
  }

  $scope.update();

}]);
