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
      Users.delete(user._id, user.name).then(function(data) { //Use the username to update tasks, since assignedUser is for some reason not always set
        //Remove from visible list
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

mp4Controllers.controller('ProfileController', ['$scope', '$routeParams','Users', 'Tasks', 'Task', function($scope, $routeParams, Users, Tasks, Task) {
  //Fetch the user
  $scope.showCompleted = false;
  $scope.pending = [];
  $scope.completed = [];
  Users.getUser($routeParams.id).success(function(data) {
    $scope.user = data.data;
    //Fetch pending tasks
    Tasks.getBulk($scope.user.pendingTasks).success(function(data) {
      $scope.pending = data.data;
    });
  });
  $scope.getDate = function(date) {
    var d = new Date(date);
    return d.toLocaleDateString("en-us")
  };
  $scope.showCompletedTasks = function() {
    //This probably should use the user ID to find tasks, but since
    //the test script didn't add user IDs to tasks, the username will have to work (hopefully no duplicate names)
    $scope.showCompleted = true;
      Tasks.getByUserName($scope.user.name, 'completed').success(function(data) {
        $scope.completed = data.data;
    });
  };
  $scope.markComplete = function(task) {
    var index = $scope.pending.indexOf(task);
    task.completed = true;
    Task.put(task); // Update in database
    //Remove from pending
    $scope.pending.splice(index, 1);
    //Add to completed, so that it will show up even without another http request
    $scope.completed.push(task);
  };
}]);

mp4Controllers.controller('TasksController', ['$scope', 'Tasks', 'Task', function($scope, Tasks, Task) {
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
      $scope.pages = Math.ceil(data.data / 10.0);
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
    Task.delete(task).then(function(data) {
      reload();
    });
  };
  $scope.update(); //Initialize
}]);

mp4Controllers.controller('TaskInfoController', ['$scope', '$routeParams', 'Task', function($scope, $routeParams, Task) {
  $scope.getDate = function(date) {
    var d = new Date(date);
    return d.toLocaleDateString("en-us")
  };
  Task.getTask($routeParams.id).success(function(data) {
    $scope.task = data.data;
  });
}]);

mp4Controllers.controller('AddTaskController', ['$scope', 'Users', 'Task', function($scope, Users, Task) {
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
    Task.post($scope.task)
    .then(function(data) {
      $scope.success = true;
      $scope.task = {}; //Clear task in view
      $scope.selectedUser = $scope.users[0];
    })
    .catch(function(error) {
      $scope.fail = true;
      $scope.error = error.message;
    });
  };
}]);

mp4Controllers.controller('EditTaskController', ['$scope', '$routeParams', 'Users', 'Task', function($scope, $routeParams, Users, Task) {
  $(document).foundation(); //The fact that I have to do this is really dumb. Needed so callouts work
  $scope.success = false;
  $scope.fail = false;
  //Get the task to edit
  Task.getTask($routeParams.id).success(function(data) {
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
    Task.put($scope.task)
    .then(function(data) {
      $scope.success = true;
    })
    .catch(function(error) {
      $scope.fail = true;
      $scope.error = error.message;
    });
  };
}]);
