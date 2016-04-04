var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function($http, $window) {
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
        delete : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/users/'+id);
        }
    }
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
      get : function(sortBy, order, page, status) {
        //Get tasks based on given parameters
        var url = $window.sessionStorage.baseurl + '/api/tasks';
        var options = {};
        options['select'] = {'name': 1, 'assignedUserName': 1, '_id': 1, 'deadline': 1};
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
      getTask : function(id) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl + '/api/tasks/' + id);
      },
      getBulk : function(taskIDs, restrict) {
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
      },
      delete : function(id) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.delete(baseUrl + '/api/tasks/' + id);
      },
      post : function(task) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.post(baseUrl+'/api/tasks', task);
      },
      put : function(task) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.put(baseUrl+'/api/tasks/'+task._id, task);
      }
    }
});
