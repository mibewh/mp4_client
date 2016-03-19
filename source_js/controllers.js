var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

mp4Controllers.controller('UsersController', ['$scope', 'Users', function($scope, Users) {
    var refresh = function() {
      Users.get().success(function(data) {
        $scope.users = data.data;
      });
    }
    refresh();
    $scope.delete = function(id) {
      Users.delete(id).success(function(data) {
        refresh(); //Refresh list after a delete
      }); 
    }
}]);

mp4Controllers.controller('AddUserController', ['$scope', 'Users', function($scope, Users) {
    $(document).foundation(); //The fact that I have to do this is really dumb
    $scope.user = {};
    $scope.submit = function() {
      //Hide callouts
      $scope.fail = false;
      $scope.success = false;
      console.log($scope.user);
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

mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();
  };

}]);


mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
    $scope.show = true;
  };

}]);
