var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users');
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
      getByUser : function(user, status) {

      }
    }
});
