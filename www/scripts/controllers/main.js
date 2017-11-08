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
  .controller('MainCtrl', function ($scope, $localStorage, $location, $sessionStorage, mainServiceObj) {

    var place_id = '';
    var latitude = '';
    var longitude = '';
    var images = ''
    var mapProp = {
      center: new google.maps.LatLng(51.508742, -0.120850),
      zoom: 15,
    };
    $scope.dataLoading = false;
    $scope.showVideo = true;

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    function onSuccess(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    };

    function onError(error) {
      alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }    

    //Cordova settings for camera

    //Get access to the camera!

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now

      navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
    }

    $scope.rating = '';
    $scope.types = ' '; 

    //The function for finding place details

    document.getElementById("cameraTakePicture").addEventListener
      ("click", cameraTakePicture);

    function cameraTakePicture() {

      $scope.dataLoading = true;
      $scope.showVideo = false;
      navigator.geolocation.getCurrentPosition(onSuccesss, onError);

      function onSuccesss(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      };

      function onError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      }

      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      });

      function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
        localStorage.setItem("canvas", image.src);

        mainServiceObj.getCoordinates(latitude, longitude)
          .then(function (success) {
         
            place_id = success.data.results[0].place_id;
e  
            var mapProp = {
              center: new google.maps.LatLng(latitude, longitude),
              zoom: 15,
            };

            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            mainServiceObj.getQuality(place_id)
              .then(function (success) {
                // console.log(success)
                $scope.types = success.data.result.types[0];
                $scope.rating = '' + success.data.result.name;
                $scope.dataLoading = false;
                $scope.showVideo = true;
              });
          });

      }

      function onFail(message) {
        alert('Failed because: ' + message);
      }
    }

    //Local storage functionality

    $scope.list = []
    $scope.x = {}

    if ($localStorage.list) {
      $scope.$storage = $localStorage.list;
      $scope.list = $localStorage.list;
    }

    $scope.downloads = function (x) {
      download(x, "selfie.png", "image/png")
    }

    $scope.savePlaces = function (x) {

      $scope.image = localStorage.getItem("canvas");
      $scope.x.types = $scope.types;
      $scope.x.rating = $scope.rating;
      $scope.x.image = $scope.image;

      $scope.list.push(x);
      $localStorage.list = $scope.list;
      $scope.$storage = $localStorage.list;
      $location.url('/MyPlaces');
    }

    $scope.deletePlaces = function (x) {
      $localStorage.list.splice(x, 1);
    }
  });
