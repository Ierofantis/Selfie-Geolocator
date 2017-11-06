'use strict';
/**
 * @ngdoc function
 * @name qcApp.service:mainServiceObj
 * @description
 * # mainServiceObj
 * Service of the qcApp
 */

angular.module('qcApp')
  .service('mainServiceObj', function($http) {

    return {

      getCoordinates: function(lat, long) {
        var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        var path = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyCHf2EeOg7T167gSkNU_ljDPetPXysSMFg';

        return $http.get(PROXY_URL + path)
      },

      getQuality: function(place) {
        var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        var path = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place + '&key=AIzaSyCHf2EeOg7T167gSkNU_ljDPetPXysSMFg';

        return $http.get(PROXY_URL + path)
      }
    };
  });
