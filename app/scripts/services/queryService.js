'use strict';
angular.module('tableGraphExplorerApp').factory('QueryService', ['$log', '$http', 'GremlinQueryParser','ConfigService', function ($log, $http, GremlinQueryParser,ConfigService) {
        $log.log("Initializing query service");
        

        return {

            query: function (query) {

                return $http.post(ConfigService.getConfig().endpoint, {gremlin: query}).then(function (xhr) {
                    $log.log("Raw query response", xhr);
                    return GremlinQueryParser.parseQuery(xhr.data);
                }, function (xhr) {
                    $log.log("Error querying data", xhr);
                });

            }
        };
    }]);
