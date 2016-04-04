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
    Users.get({'name': 1, 'email': 1, '_id': 1}).success(function(data) {
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
    $scope.fail = false;
    $scope.success = false;
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

mp4Controllers.controller('ProfileController', ['$scope', '$routeParams','Users', 'Tasks', function($scope, $routeParams, Users, Tasks) {
  //Fetch the user
  Users.getUser($routeParams.id).success(function(data) {
    $scope.user = data.data;
    //Fetch pending tasks
    Tasks.getBulk($scope.user.pendingTasks, true).success(function(data) {
      $scope.pending = data.data;
    });
  });
  $scope.getCompleted = function() {
    //This probably should use the user ID to find tasks, but since
    //the test script didn't add user IDs to tasks, the username will have to do (hopefully no duplicate names)
    Tasks.getByUserName($scope.user.name, 'completed').success(function(data) {
      $scope.completed = data.data;
    });
  };
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
  };
  $scope.getDate = function(date) {
    var d = new Date(date);
    return d.toLocaleDateString("en-us")
  };
  $scope.delete = function(task) {
    Tasks.delete(task._id).success(function(data) {
      reload();
    });
  };
  $scope.update(); //Initialize
}]);

mp4Controllers.controller('TaskInfoController', ['$scope', '$routeParams', 'Tasks', function($scope, $routeParams, Tasks) {
  $scope.getDate = function(date) {
    var d = new Date(date);
    return d.toLocaleDateString("en-us")
  };
  Tasks.getTask($routeParams.id).success(function(data) {
    $scope.task = data.data;
  });
}]);

mp4Controllers.controller('AddTaskController', ['$scope', 'Users', 'Tasks', function($scope, Users, Tasks) {
  $(document).foundation(); //The fact that I have to do this is really dumb. Needed so callouts work
  $scope.task = {};
  $scope.success = false;
  $scope.fail = false;
  Users.get({'_id': 1, 'name': 1}).success(function(data) {
    $scope.users = data.data;
    $scope.users.unshift({'_id': '', 'name': 'unassigned'});
    $scope.selectedUser = $scope.users[0];
  });
  $scope.submit = function() {
    $scope.task.assignedUserName = $scope.selectedUser.name;
    $scope.task.assignedUser = $scope.selectedUser._id;
    Tasks.post($scope.task)
    .success(function(data) {
      $scope.success = true;
    })
    .error(function(error) {
      $scope.fail = true;
      $scope.error = error.message;
    });
  };
}]);

mp4Controllers.controller('EditTaskController', ['$scope', '$routeParams', 'Users', 'Tasks', function($scope, $routeParams, Users, Tasks) {
  $(document).foundation(); //The fact that I have to do this is really dumb. Needed so callouts work
  $scope.success = false;
  $scope.fail = false;
  //Get the task to edit
  Tasks.getTask($routeParams.id).success(function(data) {
    $scope.task = data.data;
    //Get the users list
    Users.get({'_id': 1, 'name': 1}).success(function(data) {
      $scope.users = data.data;
      $scope.users.unshift({'_id': '', 'name': 'unassigned'});
      //Find the corresponding user
      $scope.selectedUser = $scope.users.filter(function(user) {
        return user.name == $scope.task.assignedUserName;
      })[0];
    });
  });
  $scope.submit = function() {
    $scope.task.assignedUserName = $scope.selectedUser.name;
    $scope.task.assignedUser = $scope.selectedUser._id;
    Tasks.put($scope.task)
    .success(function(data) {
      $scope.success = true;
    })
    .error(function(error) {
      $scope.fail = true;
      $scope.error = error.message;
    });
  };
}]);
