var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function($http, $window, $q, Tasks) {
    return {
        get : function(select) {
            var baseUrl = $window.sessionStorage.baseurl;
            var options = {};
            options['select'] = select;
            return $http.get(baseUrl+'/api/users', {params: options});
        },
        getUser: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users/'+id);
        },
        post : function(user) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/users', user);
        },
        put : function(user) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl+'/api/users/'+user._id, user);
        },
        delete : function(id, name) {
            var baseUrl = $window.sessionStorage.baseurl;
            var deferred = $q.defer();
            //Update pending tasks with this user assigned
            Tasks.getByUserName(name, 'pending').success(function(data) {
              data.data.forEach(function(task) {
                task.assignedUser = "";
                task.assignedUserName = "unassigned";
                $http.put(baseUrl+'/api/tasks/'+task._id, task);
              });
            });
            $http.delete(baseUrl+'/api/users/'+id).success(function(data) {
              deferred.resolve(data);
            }).catch(function(err) {
              deferred.reject(err);
            });
            return deferred.promise;
        }
    }
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
      get : function(sortBy, order, page, status) {
        //Get tasks based on given parameters
        var url = $window.sessionStorage.baseurl + '/api/tasks';
        var options = {};
        options['select'] = {'name': 1, 'assignedUserName': 1, 'assignedUser': 1, '_id': 1, 'deadline': 1};
        var sort = {};
        sort[sortBy] = order ? -1 : 1;
        options["sort"] = sort;
        if(status == 'completed')
          options["where"] = {completed: true};
        else if(status == 'pending')
          options["where"] = {completed: false};
        options["limit"] = 10;
        options["skip"] = page * 10;
        return $http.get(url, {params: options});
      },
      getCount : function(status) {
        var url = $window.sessionStorage.baseurl + '/api/tasks';
        var options = {};
        if(status == 'completed')
          options["where"] = {completed: true};
        else if(status == 'pending')
          options["where"] = {completed: false};
        options['count'] = true;
        return $http.get(url, {params: options});
      },
      getBulk : function(taskIDs) {
        var url = $window.sessionStorage.baseurl + '/api/tasks';
        var options = {};
        options.where = {'_id': {'$in': taskIDs}};
        // if(restrict) {
        //   options.select = {'_id': 1, 'name': 1, 'deadline': 1};
        // }
        return $http.get(url, {params: options});
      },
      getByUserName : function(userName, status) {
        var url = $window.sessionStorage.baseurl + '/api/tasks';
        var options = {};
        options["where"] = {};
        if(status == 'completed')
          options.where.completed = true;
        else if(status == 'pending')
          options.where.completed = false;
        options.where.assignedUserName = userName;
        return $http.get(url, {params: options});
      }
    }
});

mp4Services.factory('Task', function($http, $window, $q, Users) {
  //If add, add user's pending. If not, remove
  function setTaskInPending(taskID, userID, add) {
    if(userID == "") return; //Do nothing if no assigned user
    Users.getUser(userID).success(function(data) {
      var user = data.data;
      var index = user.pendingTasks.indexOf(taskID);
      if(add && index < 0) { //Add if add is true and task isn't for some reason already in the list
        user.pendingTasks.push(taskID);
      }
      else if(!add && index >= 0) { //Remove if not add and task is in the list
        user.pendingTasks.splice(index, 1);
      }
      Users.put(user);
    });
  };
  return {
    getTask : function(id) {
      var baseUrl = $window.sessionStorage.baseurl;
      return $http.get(baseUrl + '/api/tasks/' + id);
    },
    delete : function(task) {
      var baseUrl = $window.sessionStorage.baseurl;
      var deferred = $q.defer();
      setTaskInPending(task._id, task.assignedUser, false); //Remove from user's pending
      $http.delete(baseUrl + '/api/tasks/' + task._id).success(function(data) {
        deferred.resolve(data);
      }).error(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    post : function(task) {
      var baseUrl = $window.sessionStorage.baseurl;
      var deferred = $q.defer();
      $http.post(baseUrl+'/api/tasks', task).success(function(data) {
        deferred.resolve(data);
        setTaskInPending(data.data._id, task.assignedUser, !data.data.completed);
      }).error(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    put : function(task) {
      var baseUrl = $window.sessionStorage.baseurl;
      var deferred = $q.defer();
      $http.put(baseUrl+'/api/tasks/'+task._id, task).success(function(data) {
        deferred.resolve(data);
        setTaskInPending(data.data._id, task.assignedUser, !task.completed);
      }).error(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
});
