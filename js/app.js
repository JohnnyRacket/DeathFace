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
        $scope.claTags;
        $scope.claAPI = function(photo_path){
          console.log("jfjfjfj");
          http({
                  url: 'https://api.clarifai.com/v1/tag/',
                  method: 'POST',
                  headers: {
                   "Authorization": "Bearer OovABTFcF52s0fmJHQ1BJZfJ3mJdCl"
                 },
                 body: {"data-urlencode": + photo_path}
                }).then(function(response){
                    console.log(response);
                    $scope.claTags = response.data;
                    console.log($scope.claTags);
                    return response;
                });
        }
        
    });
