'use strict';

/**
 * @ngdoc function
 * @name qcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the qcApp
 */

//bower ngstorage and not ngStorage!

angular.module('qcApp')
  .controller('MainCtrl', function($scope, $localStorage,$location, $sessionStorage, mainServiceObj) {

    var place_id = '';
    var latitude = '';
    var longitude = '';    
    var mapProp = {
      center: new google.maps.LatLng(51.508742, -0.120850),
      zoom: 15,
    };
     $scope.dataLoading = false;
     $scope.showVideo = true;

    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    // Elements for taking the snapshot

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');         

    // Get access to the camera!

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now

      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
    }

    $scope.rating = '';
    $scope.types = ' ';


    //html5 geolocation window when at home

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }

    //The function for finding place details

    $scope.qualityFunc = function() {          

      context.drawImage(video, 0, 0, 300, 400);
      $scope.dataLoading = true;
      $scope.showVideo = false;

      mainServiceObj.getCoordinates(latitude, longitude)
        .then(function(success) {
          wait(2000)
          place_id = success.data.results[0].place_id;

          //Configuring the map and refreshing with latitude and longitude  

          var mapProp = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: 15,
          };
          var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);          

          mainServiceObj.getQuality(place_id)
            .then(function(success) {
              $scope.types = success.data.result.types[0];              
              $scope.rating = '' + success.data.result.name;               
              $scope.dataLoading = false; 
              $scope.showVideo = true;        
            });
        });
    }

    //Local storage functionality

    $scope.list = []
    $scope.x = {}

    if ($localStorage.list) {
      $scope.$storage = $localStorage.list;
      $scope.list = $localStorage.list;
    }

     $scope.downloads = function(x) {
     download(x, "selfie.png", "image/png")     
    }

    $scope.savePlaces = function(x) {     

      localStorage.setItem("canvas", canvas.toDataURL());
      $scope.image = localStorage.getItem("canvas");       
      $scope.x.types = $scope.types;
      $scope.x.rating = $scope.rating;
      $scope.x.image = $scope.image;

      $scope.list.push(x);
      $localStorage.list = $scope.list;
      $scope.$storage = $localStorage.list;  
        $location.url('/MyPlaces');       
    }

    $scope.deletePlaces = function(x) {
      $localStorage.list.splice(x, 1);
    }
  });
