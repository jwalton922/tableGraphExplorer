'use strict';

/**
 * @ngdoc function
 * @name tableGraphExplorerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tableGraphExplorerApp
 */
angular.module('tableGraphExplorerApp')
        .controller('MainCtrl', ['$scope', '$log', '$rootScope', '$timeout', 'QueryService', 'ConfigService', function ($scope, $log, $rootScope, $timeout, QueryService, ConfigService) {
                $scope.queries = [];

                $scope.queries.push({});
                $scope.server = ConfigService.getConfig().endpoint;
                
                $scope.$watch('server', function (newValue, prevValue) {
                    ConfigService.setEndpoint(newValue);
                });
//                $log.log("graph.V()", graph.V());
                $rootScope.$on('newQuery', function (event, data) {
                    $log.log("New query event: ", data);
                    $scope.queries.push(data);
                    $timeout(function () {
                        window.scrollTo(0, document.querySelector("#mainQueryContainer").scrollHeight);
                    }, 500);
                });

            }]);
