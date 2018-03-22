'use strict';
angular.module('tableGraphExplorerApp').factory('ConfigService', ['$log', function ($log) {
    var config = {
        endpoint: "http://localhost:8080/"
    };  
    
    return {
        getConfig(){
            return config;
        },
        setEndpoint(endpoint){
            config.endpoint = endpoint; 
        }
    };
}]);
