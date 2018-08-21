'use strict';
angular.module('tableGraphExplorerApp').factory('ConfigService', ['$log', '$window', function ($log, $window) {
        var endpoint = $window.localStorage.getItem('server');
        var config = {
            endpoint: endpoint ? endpoint : "http://localhost:8182/"
        };

        return {
            getConfig() {
                return config;
            },
            setEndpoint(endpoint) {
                config.endpoint = endpoint;
                $window.localStorage.setItem('server',endpoint);
            }
        };
    }]);
