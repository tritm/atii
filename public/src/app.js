var app = angular.module('myApp', []);

app.controller('myController', myController);

function myController($scope, $http) {
  $scope.title = 'Xin chao!!!';
  $scope.userName = '';
  $scope.userId = 0;

  $scope.getName = function() {
    $http.get('/api/getName/' + $scope.userId).then(function(result) {
      $scope.userName = result.data;
    });
  };
  $scope.listUsers = function() {
    $http.get('/api/listUsers').then(function(result) {
      //NOTE: Kết quả result nhận về sẽ là 1 dict với rất nhiều trường: data, status, config, statusText, xhrStatus
      //Mình thường chỉ cần trường data
      $scope.listNames = result.data;
    })
  };
}