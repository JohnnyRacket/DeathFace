    var reactionApp = angular.module('reactionApp',[]);


    reactionApp.controller('mainController', function($scope, $http) {

        console.log("in projects controller");
        $scope.reactionPhotos;
        $scope.githubAPI = function(){

              $http({
                  url: 'https://ec2-52-90-67-8.compute-1.amazonaws.com:8080/api/photo',
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
