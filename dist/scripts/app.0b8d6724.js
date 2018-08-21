'use strict';

/**
 * @ngdoc overview
 * @name tableGraphExplorerApp
 * @description
 * # tableGraphExplorerApp
 *
 * Main module of the application.
 */
var myApp = angular
  .module('tableGraphExplorerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
  myApp.run(['$rootScope', function($rootScope){
    $rootScope.queries = [];
}]);
