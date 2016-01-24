    var reactionApp = angular.module('reactionApp');


    secApp.controller('mainController', function($scope, $http) {

        console.log("in projects controller");
        $scope.reactionPhotos;
        $scope.githubAPI = function(){

              $http({
                  url: 'https://api.github.com/users/UFSEC/repos?',
                  method: 'GET',
                  headers: {
                   'Content-Type': 'application/json'
                 }
                }).then(function(response){
                    console.log(response);
                    $scope.reactionPhotos = response.data;
                    console.log($scope.reactionPhotos);
                    return response;
                });
                
        }
        $scope.githubAPI();
        
    });
