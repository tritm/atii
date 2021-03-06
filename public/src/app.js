var app = angular.module('myApp', []);
// angular.module('myApp', ['ui.bootstrap']);
app.controller('myController', myController);

function myController($scope, $http) {
  $scope.title = 'TOTP CHECK FOR ATII';
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
      console.log('Tri all ListUsers');
    })
  };
  $scope.listFlows = function() {
    const before = window.performance.now();
    $http.get('/api/listFlows').then(function(result) {
      //NOTE: Kết quả result nhận về sẽ là 1 dict với rất nhiều trường: data, status, config, statusText, xhrStatus
      //Mình thường chỉ cần trường data
      $scope.lstFlows = result.data;
      console.log('Tri all ListFlows');
    })
    console.log(window.performance.now() - before);
  };
  $scope.stopOnu = function() {
    $http.get('/api/stopOnu').then(function(result) {
      console.log(result);
    })
  };
  $scope.startOnu = function() {
    $http.get('/api/startOnu').then(function(result) {
      console.log(result);
    })
  };
  $scope.stopFlows = function() {
    $http.get('/api/stopFlows').then(function(result) {
      console.log(result);
    })
  };
  $scope.addFlow = function() {
    $http.post('/api/addFlow').then(function(result) {
      console.log(result);
    })
  };
  $scope.addFlow1 = function() {
    $http.post('/api/addFlow1').then(function(result) {
      console.log(result);
    })
  };
  $scope.deleteHost = function(){
    $http.delete('/api/deleteHost/'+$scope.mac2delete).then(function(result){
    })
  };
  $scope.deleteFlow = function(){
    $http.delete('/api/deleteFlow/'+$scope.flowid2delete).then(function(result){
      console.log(result);
    })
  };
  $scope.deleteUser = function(){
    $http.delete('/api/deleteUser/'+$scope.phone2delete).then(function(result){
      $scope.listNames = result.data;
    })
  };
  $scope.insertUser = function(){
    var data = $.param({
      name:$scope.name2insert,
      phone:$scope.phone2insert
    });
    $scope.name2insert = '';
    $scope.phone2insert = '';
    $http.post('/api/insertUser?'+data).then(function(result){
      $scope.listNames = result.data;
    });
  };
  $scope.clean = function(){
    $http.delete('/api/clean/').then(function(result){
      console.log("[TRITM]"+result);
    })
  };
  $scope.checkToken = function(){
    var data = $.param({
      phone:$scope.phone2check,
      token:$scope.token2check
    });
    $http.get('/api/checktoken?'+data).then(function(result){
      if (result.data) {
        $scope.tokencheck = "OK";
      }
      else {
        $scope.tokencheck = "NOK";
      };
    });
  };
  $scope.showQR = function(){
    $http.get('/api/showqr/'+$scope.phone2show).then(function(result){
      $scope.imageUrl = result.data;
      console.log(result.data);
    })
  }
  $scope.reset = function(){
    $http.get('/api/reset/').then(function(result){
      console.log(result.data);
    })
  }
}
