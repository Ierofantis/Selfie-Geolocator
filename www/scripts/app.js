'use strict';

/**
 * @ngdoc overview
 * @name qcApp
 * @description
 * # qcApp
 *
 * Main module of the application.
 */
angular
  .module('qcApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'    
  ])
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/MyPlaces', {
        templateUrl: 'views/myPlaces.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
